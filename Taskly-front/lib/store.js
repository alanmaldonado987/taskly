import { create } from "zustand";
import { TASK_COLORS } from "./types";
import { addDays, subDays } from "date-fns";

// Sample data
const today = new Date();

const sampleMembers = [
  { id: "m1", name: "Mary Dendy", email: "mary@example.com", color: "#4CAF50" },
  { id: "m2", name: "Robert Chack", email: "robert@example.com", color: "#2196F3" },
  { id: "m3", name: "Sarah Miller", email: "sarah@example.com", color: "#FF9800" },
  { id: "m4", name: "John Smith", email: "john@example.com", color: "#9C27B0" },
];

const sampleTasks = [
  {
    id: "t1",
    name: "Customer Story",
    description: "Define customer requirements and user stories",
    startDate: subDays(today, 10),
    endDate: addDays(today, 5),
    progress: 75,
    status: "in-progress",
    priority: "high",
    assignees: ["m1"],
    dependencies: [],
    color: TASK_COLORS[0],
    estimatedHours: 40,
    loggedHours: 30,
  },
  {
    id: "t2",
    name: "Client Interview",
    description: "Conduct interviews with key stakeholders",
    startDate: subDays(today, 5),
    endDate: addDays(today, 2),
    progress: 100,
    status: "done",
    priority: "highest",
    assignees: ["m1", "m2"],
    dependencies: ["t1"],
    color: TASK_COLORS[1],
    estimatedHours: 16,
    loggedHours: 18,
  },
  {
    id: "t3",
    name: "Content Writing",
    description: "Write content for all sections",
    startDate: today,
    endDate: addDays(today, 10),
    progress: 25,
    status: "in-progress",
    priority: "medium",
    assignees: ["m3"],
    dependencies: ["t2"],
    color: TASK_COLORS[2],
    estimatedHours: 32,
    loggedHours: 8,
  },
  {
    id: "t4",
    name: "Design & Animation",
    description: "Create visual designs and animations",
    startDate: addDays(today, 2),
    endDate: addDays(today, 15),
    progress: 0,
    status: "open",
    priority: "high",
    assignees: ["m4"],
    dependencies: ["t3"],
    color: TASK_COLORS[3],
    estimatedHours: 48,
    loggedHours: 0,
  },
  {
    id: "t5",
    name: "Landing Design",
    description: "Design the landing page",
    startDate: addDays(today, 5),
    endDate: addDays(today, 12),
    progress: 0,
    status: "open",
    priority: "medium",
    assignees: ["m4", "m3"],
    dependencies: ["t4"],
    color: TASK_COLORS[4],
    estimatedHours: 24,
    loggedHours: 0,
  },
  {
    id: "t6",
    name: "UI Design",
    description: "Create detailed UI mockups",
    startDate: addDays(today, 8),
    endDate: addDays(today, 18),
    progress: 0,
    status: "open",
    priority: "low",
    assignees: ["m4"],
    dependencies: ["t5"],
    color: TASK_COLORS[0],
    estimatedHours: 36,
    loggedHours: 0,
  },
  {
    id: "t7",
    name: "Feature Input Pages",
    description: "Design input forms and pages",
    startDate: addDays(today, 10),
    endDate: addDays(today, 20),
    progress: 0,
    status: "open",
    priority: "medium",
    assignees: ["m2"],
    dependencies: ["t6"],
    color: TASK_COLORS[1],
    estimatedHours: 28,
    loggedHours: 0,
  },
  {
    id: "t8",
    name: "Prototype",
    description: "Build interactive prototype",
    startDate: addDays(today, 15),
    endDate: addDays(today, 22),
    progress: 0,
    status: "open",
    priority: "high",
    assignees: ["m1", "m4"],
    dependencies: ["t7"],
    color: TASK_COLORS[2],
    estimatedHours: 20,
    loggedHours: 0,
  },
  {
    id: "t9",
    name: "Current Sitemap",
    description: "Document current site structure",
    startDate: addDays(today, 18),
    endDate: addDays(today, 25),
    progress: 0,
    status: "open",
    priority: "low",
    assignees: ["m3"],
    dependencies: ["t8"],
    color: TASK_COLORS[3],
    estimatedHours: 16,
    loggedHours: 0,
  },
  {
    id: "milestone1",
    name: "Project Launch",
    description: "Official project launch milestone",
    startDate: addDays(today, 25),
    endDate: addDays(today, 25),
    progress: 0,
    status: "open",
    priority: "highest",
    assignees: [],
    dependencies: ["t9"],
    color: TASK_COLORS[4],
    isMilestone: true,
  },
];

const sampleProject = {
  id: "p1",
  name: "Website Redesign Project",
  description: "Complete website redesign with new branding",
  tasks: sampleTasks,
  members: sampleMembers,
  createdAt: subDays(today, 30),
  updatedAt: today,
};

export const useProjectStore = create((set) => ({
  project: sampleProject,
  selectedTaskId: null,
  currentView: "gantt",
  zoomLevel: "week",
  isTaskModalOpen: false,
  isSidebarCollapsed: false,

  setSelectedTask: (taskId) => set({ selectedTaskId: taskId }),
  setCurrentView: (view) => set({ currentView: view }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  setTaskModalOpen: (open) => set({ isTaskModalOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  addTask: (task) =>
    set((state) => ({
      project: {
        ...state.project,
        tasks: [...state.project.tasks, task],
        updatedAt: new Date(),
      },
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      project: {
        ...state.project,
        tasks: state.project.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
        updatedAt: new Date(),
      },
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      project: {
        ...state.project,
        tasks: state.project.tasks.filter((task) => task.id !== taskId),
        updatedAt: new Date(),
      },
    })),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      project: {
        ...state.project,
        tasks: state.project.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
        updatedAt: new Date(),
      },
    })),

  reorderTasks: (activeId, overId) =>
    set((state) => {
      const tasks = [...state.project.tasks];
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const [removed] = tasks.splice(activeIndex, 1);
        tasks.splice(overIndex, 0, removed);
      }

      return {
        project: {
          ...state.project,
          tasks,
          updatedAt: new Date(),
        },
      };
    }),
}));