import { useState } from "react";
import API from "../services/api";

function AddTask({ onTaskAdded }) {
  const [title, setTitle] = useState("");

  const handleAddTask = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      const response = await API.post("/tasks", {
        title: title,
      });

      console.log("Task created:", response.data);

      onTaskAdded(response.data);

      setTitle("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="add-task">
      <input
        type="text"
        placeholder="What do you need to accomplish?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <button onClick={handleAddTask}>
        Add Task
      </button>
    </div>
  );
}

export default AddTask;