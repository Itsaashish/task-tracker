"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, X, Edit, Trash2 } from "lucide-react";

// Task type definition
type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: Date;
};

// Priority colors mapping
const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

function App() {
  // State for tasks and UI
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "active"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  // Task form state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "personal",
  });

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error parsing tasks from localStorage", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks based on search query and filters
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((task) =>
        filterStatus === "completed" ? task.completed : !task.completed
      );
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      result = result.filter((task) => task.priority === filterPriority);
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      createdAt: new Date(),
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "personal",
    });
    setIsAddTaskOpen(false);
  };

  // Edit an existing task
  const handleEditTask = () => {
    if (!currentTask || !currentTask.title.trim()) return;

    setTasks((prev) =>
      prev.map((task) => (task.id === currentTask.id ? currentTask : task))
    );
    setIsEditTaskOpen(false);
    setCurrentTask(null);
  };

  // Delete a task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Open edit task dialog
  const openEditDialog = (task: Task) => {
    setCurrentTask(task);
    setIsEditTaskOpen(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterPriority("all");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
              onClick={() =>
                document
                  .getElementById("filterDropdown")
                  ?.classList.toggle("hidden")
              }
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <div
              id="filterDropdown"
              className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg p-4 z-10 hidden"
            >
              <div className="mb-2">
                <p className="text-sm font-medium mb-1">Status</p>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as "all" | "completed" | "active"
                    )
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-2">
                <p className="text-sm font-medium mb-1">Priority</p>
                <select
                  value={filterPriority}
                  onChange={(e) =>
                    setFilterPriority(
                      e.target.value as "all" | "low" | "medium" | "high"
                    )
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                className="w-full mt-2 px-4 py-1 border rounded-md text-sm hover:bg-gray-50"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        {/* Active filters display */}
        {(filterStatus !== "all" ||
          filterPriority !== "all" ||
          searchQuery) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filterStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                Status: {filterStatus}
                <button
                  className="ml-1 p-0"
                  onClick={() => setFilterStatus("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterPriority !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                Priority: {filterPriority}
                <button
                  className="ml-1 p-0"
                  onClick={() => setFilterPriority("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                Search: {searchQuery}
                <button className="ml-1 p-0" onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-500">No tasks found</p>
            {tasks.length > 0 && (
              <button
                className="text-blue-500 hover:underline"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 transition-all ${
                task.completed ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1 h-4 w-4"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                      {task.category}
                    </span>
                  </div>

                  {task.description && (
                    <p
                      className={`text-sm ${
                        task.completed ? "text-gray-500" : ""
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {task.createdAt.toLocaleDateString()}
                    </span>

                    <div className="flex gap-2">
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => openEditDialog(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add task dialog */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Task title"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description (optional)"
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setIsAddTaskOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit task dialog */}
      {isEditTaskOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Title
                </label>
                <input
                  id="edit-title"
                  value={currentTask.title}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={currentTask.description}
                  onChange={(e) =>
                    setCurrentTask({
                      ...currentTask,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="edit-priority"
                    className="text-sm font-medium"
                  >
                    Priority
                  </label>
                  <select
                    id="edit-priority"
                    value={currentTask.priority}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="edit-category"
                    className="text-sm font-medium"
                  >
                    Category
                  </label>
                  <select
                    id="edit-category"
                    value={currentTask.category}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-completed"
                  checked={currentTask.completed}
                  onChange={(e) =>
                    setCurrentTask({
                      ...currentTask,
                      completed: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="edit-completed" className="text-sm font-medium">
                  Mark as completed
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setIsEditTaskOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleEditTask}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
