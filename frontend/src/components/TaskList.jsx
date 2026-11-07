import TaskItem from "./TaskItem";

function TaskList({ tasks, onTaskDeleted, onTaskUpdated }) {
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <section className="task-section">
      <div className="task-header">
        <div>
          <p className="section-label">TODAY&apos;S FOCUS</p>
          <h2>My Tasks</h2>
        </div>

        <div className="task-summary">
          <strong>{tasks.length}</strong>
          <span>{tasks.length === 1 ? "task" : "tasks"}</span>
        </div>
      </div>

      {tasks.length > 0 && (
        <p className="progress-text">
          {completedTasks} of {tasks.length} completed
        </p>
      )}

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">+</div>
            <h3>Your task list is clear</h3>
            <p>Add your first task above to get started.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskDeleted={onTaskDeleted}
              onTaskUpdated={onTaskUpdated}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default TaskList;