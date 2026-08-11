import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

import Header from "./components/Header";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((previousTasks) => [...previousTasks, newTask]);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task._id !== taskId)
    );
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  return (
    <div className="app">
      <Header />

      <main className="container">
        <AddTask onTaskAdded={handleTaskAdded} />

        <TaskList
          tasks={tasks}
          onTaskDeleted={handleTaskDeleted}
          onTaskUpdated={handleTaskUpdated}
        />
      </main>
    </div>
  );
}

export default App;