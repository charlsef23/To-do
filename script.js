document.addEventListener("DOMContentLoaded", () => {
  const listInput = document.getElementById("listInput");
  const addListBtn = document.getElementById("addListBtn");
  const listsContainer = document.getElementById("lists");
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskPriority = document.getElementById("taskPriority");
  const taskDueDate = document.getElementById("taskDueDate");
  const taskSearchInput = document.getElementById("taskSearchInput");
  const completeAllBtn = document.getElementById("completeAllBtn");
  const taskList = document.getElementById("taskList");
  const summaryText = document.getElementById("summaryText");

  let lists = [];
  let currentListId = null;

  function updateSummary() {
    const currentList = lists.find((list) => list.id === currentListId);
    if (!currentList) return;

    const totalTasks = currentList.tasks.length;
    const pendingTasks = currentList.tasks.filter((task) => !task.completed).length;
    const overdueTasks = currentList.tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return !task.completed && dueDate < new Date();
    }).length;

    summaryText.textContent = `Total: ${totalTasks} | Pending: ${pendingTasks} | Overdue: ${overdueTasks}`;
  }

  function renderLists() {
    listsContainer.innerHTML = ""; // Limpia la lista de la interfaz
  
    lists.forEach((list) => {
      const listItem = document.createElement("button");
      listItem.textContent = list.name;
      listItem.classList.add("list-item");
      if (list.id === currentListId) {
        listItem.classList.add("active");
      }
  
      // Cambiar a esta lista al hacer clic
      listItem.addEventListener("click", () => {
        currentListId = list.id;
        renderTasks();
        updateSummary();
      });
  
      listsContainer.appendChild(listItem);
    });
  }

  function renderTasks() {
    taskList.innerHTML = ""; // Limpia la lista de tareas
  
    const currentList = lists.find((list) => list.id === currentListId);
    if (!currentList) return;
  
    currentList.tasks.forEach((task) => {
      const li = document.createElement("li");
      li.classList.add(task.completed ? "completed" : "pending");
  
      const taskText = document.createElement("span");
      taskText.textContent = `${task.text} (${task.priority})`;
  
      if (task.dueDate) {
        const dueDate = document.createElement("span");
        dueDate.textContent = ` | Due: ${task.dueDate}`;
        dueDate.style.marginLeft = "10px";
        taskText.appendChild(dueDate);
      }
  
      const completeBtn = document.createElement("button");
      completeBtn.textContent = task.completed ? "Uncheck" : "Check";
      completeBtn.addEventListener("click", () => {
        task.completed = !task.completed;
        renderTasks();
        updateSummary();
      });
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => {
        currentList.tasks = currentList.tasks.filter((t) => t.id !== task.id);
        renderTasks();
        updateSummary();
      });
  
      li.appendChild(taskText);
      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  addListBtn.addEventListener("click", () => {
    const listName = listInput.value.trim();
    if (listName === "") return alert("List name cannot be empty!");
  
    const newList = {
      id: Date.now(),
      name: listName,
      tasks: [],
    };
  
    lists.push(newList);
    listInput.value = "";
    renderLists();
  });

  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;
  
    if (taskText === "") return alert("Task cannot be empty!");
    if (currentListId === null) return alert("Select a list first!");
  
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      priority,
      dueDate,
    };
  
    const currentList = lists.find((list) => list.id === currentListId);
    currentList.tasks.push(task);
  
    taskInput.value = "";
    taskDueDate.value = "";
    renderTasks();
    updateSummary();
  });

  taskSearchInput.addEventListener("input", () => {
    if (currentListId === null) return;
  
    const searchText = taskSearchInput.value.toLowerCase();
    const currentList = lists.find((list) => list.id === currentListId);
  
    const filteredTasks = currentList.tasks.filter((task) =>
      task.text.toLowerCase().includes(searchText)
    );
  
    renderFilteredTasks(filteredTasks);
  });
  
  function renderFilteredTasks(tasks) {
    taskList.innerHTML = "";
  
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.classList.add(task.completed ? "completed" : "pending");
  
      const taskText = document.createElement("span");
      taskText.textContent = `${task.text} (${task.priority})`;
  
      if (task.dueDate) {
        const dueDate = document.createElement("span");
        dueDate.textContent = ` | Due: ${task.dueDate}`;
        dueDate.style.marginLeft = "10px";
        taskText.appendChild(dueDate);
      }
  
      const completeBtn = document.createElement("button");
      completeBtn.textContent = task.completed ? "Uncheck" : "Check";
      completeBtn.addEventListener("click", () => {
        task.completed = !task.completed;
        renderTasks();
        updateSummary();
      });
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => {
        const currentList = lists.find((list) => list.id === currentListId);
        currentList.tasks = currentList.tasks.filter((t) => t.id !== task.id);
        renderTasks();
        updateSummary();
      });
  
      li.appendChild(taskText);
      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  completeAllBtn.addEventListener("click", () => {
    if (currentListId === null) return alert("Select a list first!");
  
    const currentList = lists.find((list) => list.id === currentListId);
    currentList.tasks.forEach((task) => {
      task.completed = true;
    });
  
    renderTasks();
    updateSummary();
  });

  
});