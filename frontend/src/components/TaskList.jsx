import TaskItem from "./TaskItem";

function TaskList({ tasks, onTaskDeleted, onTaskUpdated }) {
  return (
    <section className="task-section">
      <div className="task-header">
        <h2>My Tasks</h2>

        <span>
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onTaskDeleted={onTaskDeleted}
            onTaskUpdated={onTaskUpdated}
          />
        ))}
      </div>
    </section>
  );
}

export default TaskList;