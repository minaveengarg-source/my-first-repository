import React, { useState, useEffect } from "react";

export default function TodoApp() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  const addTask = () => {
    if (!taskInput.trim()) return;

    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskInput("");
  };

  // Toggle Task Completion
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  // Edit Task
  const editTask = (id) => {
    const updatedText = prompt("Edit your task:");

    if (!updatedText || !updatedText.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, text: updatedText }
          : task
      )
    );
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // Statistics
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  // Styles
  const s = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #667eea, #764ba2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Arial",
    },

    card: {
      width: "100%",
      maxWidth: "600px",
      background: "#fff",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },

    title: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#333",
    },

    inputContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },

    input: {
      flex: 1,
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "15px",
    },

    addBtn: {
      padding: "12px 18px",
      border: "none",
      borderRadius: "10px",
      background: "#667eea",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    },

    filterContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },

    filterBtn: {
      padding: "8px 15px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      background: "#eee",
      fontWeight: "bold",
    },

    activeFilter: {
      background: "#667eea",
      color: "#fff",
    },

    stats: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      gap: "10px",
      flexWrap: "wrap",
    },

    statCard: {
      flex: 1,
      background: "#f5f7ff",
      padding: "15px",
      borderRadius: "12px",
      textAlign: "center",
      minWidth: "120px",
    },

    taskList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    taskItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px",
      borderRadius: "12px",
      background: "#f9f9f9",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },

    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
    },

    checkbox: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: "2px solid #667eea",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "12px",
      color: "#fff",
    },

    completedCheckbox: {
      background: "#667eea",
    },

    taskText: {
      fontSize: "15px",
      color: "#333",
    },

    completedText: {
      textDecoration: "line-through",
      opacity: 0.6,
    },

    actions: {
      display: "flex",
      gap: "8px",
    },

    editBtn: {
      border: "none",
      padding: "8px 10px",
      borderRadius: "8px",
      background: "#ffc107",
      cursor: "pointer",
      color: "#fff",
      fontWeight: "bold",
    },

    deleteBtn: {
      border: "none",
      padding: "8px 10px",
      borderRadius: "8px",
      background: "#ff4d4d",
      cursor: "pointer",
      color: "#fff",
      fontWeight: "bold",
    },

    empty: {
      textAlign: "center",
      color: "#666",
      marginTop: "20px",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>React Todo App ✅</h1>

        {/* Input */}
        <div style={s.inputContainer}>
          <input
            type="text"
            placeholder="Enter a task..."
            value={taskInput}
            onChange={(e) =>
              setTaskInput(e.target.value)
            }
            style={s.input}
          />

          <button
            type="button"
            style={s.addBtn}
            onClick={addTask}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1";
            }}
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div style={s.filterContainer}>
          {["all", "completed", "pending"].map(
            (item) => (
              <button
                key={item}
                type="button"
                style={{
                  ...s.filterBtn,
                  ...(filter === item
                    ? s.activeFilter
                    : {}),
                }}
                onClick={() => setFilter(item)}
              >
                {item.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* Stats */}
        <div style={s.stats}>
          <div style={s.statCard}>
            <h3>{tasks.length}</h3>
            <p>Total</p>
          </div>

          <div style={s.statCard}>
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>

          <div style={s.statCard}>
            <h3>{pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>

        {/* Task List */}
        <div style={s.taskList}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                style={s.taskItem}
              >
                <div style={s.leftSection}>
                  <div
                    role="button"
                    aria-label="Toggle Task"
                    style={{
                      ...s.checkbox,
                      ...(task.completed
                        ? s.completedCheckbox
                        : {}),
                    }}
                    onClick={() =>
                      toggleTask(task.id)
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </div>

                  <span
                    style={{
                      ...s.taskText,
                      ...(task.completed
                        ? s.completedText
                        : {}),
                    }}
                  >
                    {task.text}
                  </span>
                </div>

                <div style={s.actions}>
                  <button
                    type="button"
                    style={s.editBtn}
                    onClick={() =>
                      editTask(task.id)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    style={s.deleteBtn}
                    onClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={s.empty}>
              No tasks found 🚀
            </p>
          )}
        </div>
      </div>
    </div>
  );
}