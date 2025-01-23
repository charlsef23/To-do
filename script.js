document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    const stats = document.getElementById("stats");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const addListBtn = document.getElementById("addListBtn");
    const deleteListBtn = document.getElementById("deleteListBtn");
    const listNames = document.getElementById("listNames");
    const darkModeToggle = document.getElementById("darkModeToggle");
  
    let lists = []; // Lista de listas de tareas
    let currentListId = null; // ID de la lista seleccionada
    let filter = "all"; // Filtro de tareas (all, completed, pending)
  
    // Agregar una lista
    addListBtn.addEventListener("click", () => {
      const listName = prompt("Enter the name of the new list:");
  
      if (listName && !lists.some(list => list.name === listName)) {
        const newList = {
          id: Date.now(),
          name: listName,
          tasks: []
        };
  
        lists.push(newList);
        renderListNames();
        selectList(newList.id);
      } else {
        alert("List name is required or already exists.");
      }
    });
  
    // Eliminar la lista seleccionada
    deleteListBtn.addEventListener("click", () => {
      if (currentListId !== null) {
        lists = lists.filter(list => list.id !== currentListId);
        renderListNames();
        taskList.innerHTML = "";
        stats.textContent = "Total: 0 | Completed: 0 | Pending: 0";
        currentListId = null;
      } else {
        alert("Please select a list to delete.");
      }
    });
  
    // Seleccionar una lista
    function selectList(listId) {
      const list = lists.find(list => list.id === listId);
      currentListId = listId;
      taskList.innerHTML = "";
      renderTasks();
      renderListNames();
    }
  
    // Renderizar las listas en la interfaz
    function renderListNames() {
      listNames.innerHTML = "";
      lists.forEach((list) => {
        const listItem = document.createElement("button");
        listItem.textContent = list.name;
        listItem.classList.add("list-item");
        if (list.id === currentListId) {
          listItem.classList.add("selected");
        }
        listItem.addEventListener("click", () => selectList(list.id));
        listNames.appendChild(listItem);
      });
    }
  
    // Agregar tarea
    addTaskBtn.addEventListener("click", () => {
      if (taskInput.value.trim() === "") return;
      if (currentListId === null) return alert("Select a list first!");
  
      const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false,
      };
  
      const list = lists.find(list => list.id === currentListId);
      list.tasks.push(task);
      taskInput.value = "";
      renderTasks();
    });
  
    // Renderizar tareas
    function renderTasks() {
      if (currentListId === null) return;
  
      const list = lists.find(list => list.id === currentListId);
      taskList.innerHTML = "";
  
      const filteredTasks = list.tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
      });
  
      filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add(task.completed ? "completed" : "pending");
  
        // Texto de la tarea
        const span = document.createElement("span");
        span.textContent = task.text;
  
        // Botón para marcar como completado
        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Uncheck" : "Check";
        completeBtn.addEventListener("click", () => {
          task.completed = !task.completed;
          renderTasks();
        });
  
        // Botón de eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
          list.tasks = list.tasks.filter(t => t.id !== task.id);
          renderTasks();
        });
  
        li.appendChild(span);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
  
      updateStats();
    }
  
    // Actualizar estadísticas
    function updateStats() {
      if (currentListId === null) return;
  
      const list = lists.find(list => list.id === currentListId);
      const totalTasks = list.tasks.length;
      const completedTasks = list.tasks.filter((task) => task.completed).length;
      const pendingTasks = totalTasks - completedTasks;
  
      stats.textContent = `Total: ${totalTasks} | Completed: ${completedTasks} | Pending: ${pendingTasks}`;
    }
  
    // Filtrar tareas
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filter = btn.dataset.filter;
        renderTasks();
      });
    });
  
    // Alternar modo oscuro
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  });