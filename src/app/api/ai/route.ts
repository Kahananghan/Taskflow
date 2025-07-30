import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const getFallbackResponse = (type: string, tasks: any[], message?: string) => {
  console.log('getFallbackResponse called with:', { type, tasksCount: tasks.length, tasks }); // Debug
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const urgent = tasks.filter(t => t.priority === 'URGENT' && !t.completed).length;
  const high = tasks.filter(t => t.priority === 'HIGH' && !t.completed).length;
  const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
  
  switch (type) {
    case 'suggestions':
      let suggestions = [];
      
      if (urgent > 0) suggestions.push(`🚨 You have ${urgent} urgent task${urgent > 1 ? 's' : ''} - tackle these first!`);
      if (overdue > 0) suggestions.push(`⚠️ ${overdue} task${overdue > 1 ? 's are' : ' is'} overdue - prioritize these immediately`);
      if (high > 0) suggestions.push(`🎯 Focus on your ${high} high-priority task${high > 1 ? 's' : ''} next`);
      if (pending > 5) suggestions.push(`📝 Consider breaking down large tasks into smaller, manageable steps`);
      
      if (suggestions.length === 0) {
        suggestions = [
          '✅ Great job staying organized!',
          '🎯 Set specific time blocks for each task',
          '📅 Review your task list every morning',
          '🔄 Update task priorities as needed'
        ];
      }
      
      return `💡 Personalized Suggestions:\n\n${suggestions.map(s => `• ${s}`).join('\n')}`;
      
    case 'chat':
      if (message?.toLowerCase().includes('priority')) {
        return `🎯 Priority Management Tips:\n\n• Urgent tasks: ${urgent} (do first)\n• High priority: ${high} (do next)\n• Focus on one priority level at a time\n• Review priorities weekly`;
      }
      if (message?.toLowerCase().includes('time') || message?.toLowerCase().includes('schedule')) {
        return `⏰ Time Management Tips:\n\n• Use time-blocking for focused work\n• Batch similar tasks together\n• Take 5-minute breaks between tasks\n• Set realistic deadlines`;
      }
      return `💬 Task Management Help:\n\n• You have ${pending} pending tasks\n• ${completed} tasks completed so far\n• Focus on high-priority items first\n• Break large tasks into smaller steps`;
      
    case 'analyze':
      if (total === 0) {
        return `📊 Task Analysis:\n\n🎯 You haven't created any tasks yet!\n\n💡 Recommendations:\n• Start by adding your first task\n• Break down big goals into smaller tasks\n• Set priorities and due dates\n• Use the AI assistant for productivity tips`;
      }
      
      const completionRate = Math.round((completed/total)*100);
      const priorityBreakdown = {
        urgent: tasks.filter(t => t.priority === 'URGENT').length,
        high: tasks.filter(t => t.priority === 'HIGH').length,
        medium: tasks.filter(t => t.priority === 'MEDIUM').length,
        low: tasks.filter(t => t.priority === 'LOW').length
      };
      
      let insights = [];
      let recommendations = [];
      
      // Completion analysis
      if (completionRate >= 80) {
        insights.push('🌟 Excellent productivity! You\'re completing most tasks');
        recommendations.push('Keep up the great work and maintain this momentum');
      } else if (completionRate >= 60) {
        insights.push('👍 Good progress, but there\'s room to improve');
        recommendations.push('Focus on completing 1-2 more tasks daily');
      } else if (completionRate >= 40) {
        insights.push('📈 Moderate completion rate - needs improvement');
        recommendations.push('Try breaking large tasks into smaller, manageable steps');
      } else {
        insights.push('🎯 Low completion rate - time to refocus');
        recommendations.push('Start with easiest tasks to build momentum');
      }
      
      // Priority analysis
      if (urgent > 0) {
        insights.push(`🚨 ${urgent} urgent tasks require immediate action`);
        recommendations.push('Handle urgent tasks first thing in the morning');
      }
      
      if (overdue > 0) {
        insights.push(`⚠️ ${overdue} tasks are overdue and affecting productivity`);
        recommendations.push('Reschedule overdue tasks with realistic deadlines');
      }
      
      // Workload analysis
      if (pending > 10) {
        insights.push('📚 Heavy workload detected - consider prioritizing');
        recommendations.push('Focus on top 3 most important tasks daily');
      } else if (pending < 3 && total > 3) {
        insights.push('✨ Light workload - good time to plan ahead');
        recommendations.push('Add new goals or break down future projects');
      }
      
      // Priority distribution insights
      if (priorityBreakdown.urgent + priorityBreakdown.high > total * 0.7) {
        insights.push('🔥 Most tasks are high priority - may cause stress');
        recommendations.push('Re-evaluate priorities - not everything can be urgent');
      }
      
      const analysisResult = `📊 Your Task Analysis:\n\n📈 Performance Metrics:\n• Total Tasks: ${total}\n• Completed: ${completed} (${completionRate}%)\n• Pending: ${pending}\n• Urgent: ${urgent} | High: ${priorityBreakdown.high}\n• Overdue: ${overdue}\n\n🔍 Key Insights:\n${insights.map(i => `• ${i}`).join('\n')}\n\n💡 Personalized Recommendations:\n${recommendations.map(r => `• ${r}`).join('\n')}`;
      console.log('Analysis result:', analysisResult); // Debug
      return analysisResult;
      
    default:
      return 'AI assistant is currently unavailable. Please try again later.';
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, tasks, type } = await request.json();
    console.log('AI API received:', { type, tasksCount: tasks?.length, hasOpenAI: !!openai }); // Debug

    // ALWAYS use fallback response for now to ensure it works
    console.log('Using fallback response for type:', type); // Debug
    const fallbackResponse = getFallbackResponse(type, tasks || [], message);
    console.log('Fallback response generated:', fallbackResponse.substring(0, 100) + '...'); // Debug
    return NextResponse.json({ response: fallbackResponse });

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'suggestions':
        systemPrompt = `You are a productivity assistant. Analyze the user's tasks and provide helpful suggestions for task management, prioritization, and productivity improvements. Keep responses concise and actionable.`;
        userPrompt = `Here are my current tasks: ${JSON.stringify(tasks)}. Please provide 3-4 brief suggestions to improve my productivity and task management.`;
        break;
      
      case 'chat':
        systemPrompt = `You are a helpful task management assistant. Help users with their tasks, provide productivity tips, and answer questions about task organization. Keep responses helpful and concise.`;
        userPrompt = message;
        break;
      
      case 'analyze':
        systemPrompt = `You are a task analysis expert. Analyze the user's task patterns and provide insights about their productivity, workload distribution, and areas for improvement.`;
        userPrompt = `Analyze these tasks: ${JSON.stringify(tasks)}. Provide insights about task patterns, priority distribution, and productivity recommendations.`;
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI API Error:', error);
    // Return fallback response on error
    const { tasks, type, message } = await request.json().catch(() => ({ tasks: [], type: 'suggestions', message: '' }));
    const fallbackResponse = getFallbackResponse(type, tasks || [], message);
    return NextResponse.json({ response: fallbackResponse });
  }
}