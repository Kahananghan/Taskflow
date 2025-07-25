"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('grid');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    dueDate: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const task = await response.json();
        setTasks([task, ...tasks]);
        setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed }),
      });

      if (response.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    urgent: tasks.filter(t => t.priority === 'URGENT' && !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold gradient-text">TaskFlow Pro</h1>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome back,</span>
                <span className="font-medium">{session.user?.name || session.user?.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
              </div>
              
              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">
                      {(session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass p-6 rounded-xl hover-lift animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
          <div className="glass p-6 rounded-xl hover-lift animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          <div className="glass p-6 rounded-xl hover-lift animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-1">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>
          <div className="glass p-6 rounded-xl hover-lift animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600 mb-1">{stats.urgent}</div>
                <div className="text-sm text-gray-600">Urgent</div>
              </div>
              <div className="text-3xl">🚨</div>
            </div>
          </div>
          <div className="glass p-6 rounded-xl hover-lift animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.overdue}</div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="glass p-6 rounded-2xl mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {['all', 'pending', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filter === f
                        ? 'btn-gradient text-white shadow-lg'
                        : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created">Sort by Created</option>
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  📊
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  📋
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-gradient text-white px-6 py-3 rounded-xl font-medium shadow-lg flex items-center space-x-2 hover-lift"
            >
              <span>+</span>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Enhanced Task Form */}
        {showForm && (
          <div className="glass p-8 rounded-2xl shadow-xl mb-8 animate-fadeInScale">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">✨ Create New Task</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={createTask} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Task Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="What needs to be done?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Priority Level
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="LOW">🟢 Low Priority</option>
                    <option value="MEDIUM">🟡 Medium Priority</option>
                    <option value="HIGH">🟠 High Priority</option>
                    <option value="URGENT">🔴 Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Add more details about this task..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-gradient text-white px-8 py-3 rounded-xl font-medium shadow-lg hover-lift"
                >
                  🚀 Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Tasks Display */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTasks.length === 0 ? (
            <div className="col-span-full text-center py-16 glass rounded-2xl">
              <div className="text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? 'Start by creating your first task to get organized!' 
                  : `You don't have any ${filter} tasks at the moment.`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-gradient text-white px-8 py-4 rounded-xl font-medium shadow-lg hover-lift"
                >
                  ✨ Create Your First Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`glass p-6 rounded-2xl shadow-lg hover-lift animate-fadeInUp ${
                  task.completed ? 'opacity-75' : ''
                } ${
                  task.dueDate && new Date(task.dueDate) < new Date() && !task.completed 
                    ? 'border-l-4 border-red-500' 
                    : ''
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => toggleTask(task.id, e.target.checked)}
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                    />
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 transition-all ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-800'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`mb-3 text-sm transition-all ${
                          task.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  
                  {task.dueDate && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      new Date(task.dueDate) < new Date() && !task.completed
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}