export default function Home() {
  return (
    <div className="container">
      <h1>Simple Task Manager</h1>
      <div className="task-form">
        <input type="text" placeholder="Add a new task..." />
        <button>Add Task</button>
      </div>
      <div className="task-list">
        <div className="task">
          <span>Sample Task 1</span>
          <button>Delete</button>
        </div>
        <div className="task">
          <span>Sample Task 2</span>
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}