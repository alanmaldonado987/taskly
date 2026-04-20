/**
 * @typedef {'highest' | 'high' | 'medium' | 'low' | 'lowest'} Priority
 * @typedef {'open' | 'in-progress' | 'done' | 'closed'} Status
 * @typedef {'gantt' | 'grid' | 'board' | 'workload' | 'calendar' | 'people' | 'dashboard'} ViewType
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {string} color
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {number} progress
 * @property {Status} status
 * @property {Priority} priority
 * @property {string[]} assignees
 * @property {string} [parentId]
 * @property {string[]} dependencies
 * @property {string} color
 * @property {number} [estimatedHours]
 * @property {number} [loggedHours]
 * @property {boolean} [isMilestone]
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {Task[]} tasks
 * @property {TeamMember[]} members
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

export const TASK_COLORS = [
  "var(--gantt-task-blue)",
  "var(--gantt-task-green)",
  "var(--gantt-task-orange)",
  "var(--gantt-task-pink)",
  "var(--gantt-task-teal)",
];

export const STATUS_LABELS = {
  open: "Abierto",
  "in-progress": "En Progreso",
  done: "Terminado",
  closed: "Cerrado",
};

export const PRIORITY_LABELS = {
  highest: "Muy Alta",
  high: "Alta",
  medium: "Media",
  low: "Baja",
  lowest: "Muy Baja",
};

export const STATUS_COLORS = {
  open: "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-600",
};

export const PRIORITY_COLORS = {
  highest: "text-red-600",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  lowest: "text-gray-400",
};