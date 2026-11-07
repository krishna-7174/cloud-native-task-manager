import { useState } from "react";
import API from "../services/api";

function AddTask({ onTaskAdded }) {
  const [title, setTitle] = useState("");

  const handleAddTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const response = await API.post("/tasks", {
        title: title.trim(),
      });

      onTaskAdded(response.data);
      setTitle("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form className="add-task" onSubmit={handleAddTask}>
      <input
        type="text"
        placeholder="What needs your attention?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-label="New task title"
      />

      <button type="submit">
        <span aria-hidden="true">+</span>
        Add task
      </button>
    </form>
  );
}

export default AddTask;