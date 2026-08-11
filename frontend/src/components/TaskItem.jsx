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
    <div className={`task-item ${task.completed ? "completed" : ""}`}>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
      />

      <span className="task-title">
        {task.title}
      </span>

      <button
        className="delete-button"
        onClick={handleDelete}
      >
        🗑️
      </button>

    </div>
  );
}

export default TaskItem;