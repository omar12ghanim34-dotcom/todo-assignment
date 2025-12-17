// File: js/app.js
// Student: omar ghanim (12428201)

/* ========= Configuration ========= */
const STUDENT_ID = "12428201";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

/* ========= DOM Elements ========= */
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/* ========= Status Helper ========= */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/* ========= Load Tasks on Page Load ========= */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    setStatus("Loading tasks...");

    const url =
      `${API_BASE}/get.php?stdid=` +
      encodeURIComponent(STUDENT_ID) +
      `&key=` +
      encodeURIComponent(API_KEY);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch tasks");

    const data = await res.json();

    if (data.tasks && Array.isArray(data.tasks)) {
      data.tasks.forEach(task => renderTask(task));
    }

    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus("Error loading tasks", true);
  }
});

/* ========= Add New Task ========= */
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    try {
      setStatus("Adding task...");

      const url =
        `${API_BASE}/add.php?stdid=` +
        encodeURIComponent(STUDENT_ID) +
        `&key=` +
        encodeURIComponent(API_KEY);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if (!res.ok) throw new Error("Failed to add task");

      const data = await res.json();

      if (data.success && data.task) {
        renderTask(data.task);
        input.value = "";
        setStatus("Task added");
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error adding task", true);
    }
  });
}

/* ========= Render Task ========= */
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this task?")) return;

    try {
      setStatus("Deleting task...");

      const url =
        `${API_BASE}/delete.php?stdid=` +
        encodeURIComponent(STUDENT_ID) +
        `&key=` +
        encodeURIComponent(API_KEY) +
        `&id=` +
        encodeURIComponent(task.id);

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to delete task");

      const data = await res.json();

      if (data.success) {
        li.remove();
        setStatus("Task deleted");
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error deleting task", true);
    }
  });

  actionsDiv.appendChild(deleteBtn);
  li.appendChild(titleSpan);
  li.appendChild(actionsDiv);
  list.appendChild(li);
}
