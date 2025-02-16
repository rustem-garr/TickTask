import React, { useState, useEffect, useRef } from "react";

function ToDoComponent() {
  const [tasks, setTasks] = useState(["Dush almaly", "Ertirlik iymeli", "Ishe yoremeli"]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTask, setActiveTask] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);

  const intervalIDRef = useRef(null);
  const startTimeRef = useRef(0);

  function addTask() {
    const newTask = document.getElementById("taskTxt").value.trim();
    if (newTask) {
      document.getElementById("taskTxt").value = "";
      setTasks((t) => [...t, newTask]);
    }
  }

  function deleteTask(index) {
    if (isRunning) return; // Prevent deletion while a task is running
    setTasks((t) => t.filter((_, i) => i !== index));

    // If the deleted task was the active one, stop the timer
    if (index === activeTaskIndex) {
      resetTimer();
    }
  }

  function startTask(index) {
    if (isRunning) return; // Prevent starting a new task while one is running

    setActiveTask(tasks[index]);
    setActiveTaskIndex(index);
    setIsRunning(true);
    setElapsedTime(0);
    startTimeRef.current = Date.now();
  }

  useEffect(() => {
    if (isRunning) {
      intervalIDRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 1000);

      return () =>{
          clearInterval(intervalIDRef.current);
      }
    }

    return () => clearInterval(intervalIDRef.current);
  }, [isRunning]);

  function completeTask() {
    if (activeTask !== null) {
      setCompletedTasks((prev) => [
        ...prev,
        { name: activeTask, timeSpent: formatTime(elapsedTime) },
      ]);

      // Remove completed task from tasks
      setTasks((t) => t.filter((_, i) => i !== activeTaskIndex));

      // Reset timer
      resetTimer();
    }
  }

  function resetTimer() {
    setActiveTask(null);
    setActiveTaskIndex(null);
    setIsRunning(false);
    setElapsedTime(0);
  }

  function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 3600);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function moveDown(index) {
    if (isRunning) return; // Prevent moving while a task is running
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index + 1], updatedTasks[index]] = [updatedTasks[index], updatedTasks[index + 1]];
      setTasks(updatedTasks);
    }
  }

  function moveUp(index) {
    if (isRunning) return; // Prevent moving while a task is running
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index - 1], updatedTasks[index]] = [updatedTasks[index], updatedTasks[index - 1]];
      setTasks(updatedTasks);
    }
  }

  return (
      <div>
    <div className="tasks-container">
      <h1>To Do List (Ish spisogy)</h1>
      <input id="taskTxt" />
      <button className="btn-add" onClick={addTask}>
        Add
      </button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <div className="task-content">
              <div className="task-description">{task}</div>
              <div className="controllers">
                <button className="btn delete" onClick={() => deleteTask(index)} disabled={isRunning}>
                  Delete
                </button>
                <button className="btn down" onClick={() => moveDown(index)} disabled={isRunning}>
                  Move down
                </button>
                <button className="btn up" onClick={() => moveUp(index)} disabled={isRunning}>
                  Move up
                </button>
                <button
                  className="btn start"
                  onClick={() => startTask(index)}
                  disabled={isRunning} // Disable all start buttons if a task is running
                >
                  Start
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {activeTask && (
        <div id="task-timer-container">
          <p id="task-detail">
            {activeTask} - {formatTime(elapsedTime)}
          </p>
          <button className="btn complete" onClick={completeTask}>
            Complete
          </button>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="completed-tasks">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((task, index) => (
              <li key={index}>
                {task.name} - Completed in {task.timeSpent}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <footer className="footer">
        <p>&copy; Developed by Rustem Garr, {new Date().getFullYear()}</p>
    </footer>
    </div>
  );
}

export default ToDoComponent;
