import API from "../services/api";

function TaskItem({ task, onTaskDeleted, onTaskUpdated }) {
  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${task._id}`);
      onTaskDeleted(task._id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggle = async () => {
    try {
      const response = await API.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      onTaskUpdated(response.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <article className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          aria-label={`Mark "${task.title}" as ${
            task.completed ? "incomplete" : "complete"
          }`}
        />
        <span aria-hidden="true" />
      </label>

      <span className="task-title">{task.title}</span>

      <button
        className="delete-button"
        type="button"
        onClick={handleDelete}
        aria-label={`Delete "${task.title}"`}
        title="Delete task"
      >
        &times;
      </button>
    </article>
  );
}

export default TaskItem;