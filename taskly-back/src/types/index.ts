export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isActive: boolean;
  avatar: string | null;
  locale: string;
  timezone: string;
  theme: Theme;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  tokenType: SessionType;
  userAgent: string | null;
  ipAddress: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  isRevoked: boolean;
  expiresAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
}

export interface VerificationCode {
  id: string;
  userId: string;
  code: string;
  type: VerificationType;
  isUsed: boolean;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export enum SessionType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export enum VerificationType {
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface AuthPayload {
  sub: string;
  type: string;
}

export interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  id: string;
  projectId: string;
  defaultView: ViewType;
  visibleViews: ViewType[];
  defaultZoomLevel: ZoomLevel;
  showWeekends: boolean;
  showTodayLine: boolean;
  boardColumns: TaskStatus[];
  boardGroupBy: GroupByType;
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  taskColors: string[];
  enableComments: boolean;
  enableAttachments: boolean;
  enableTimeTracking: boolean;
  enableDependencies: boolean;
  enableSubtasks: boolean;
  enableMilestones: boolean;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  color: string;
  userId: string | null;
  role: ProjectRole;
  hoursPerWeek: number | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ViewType {
  GANTT = 'GANTT',
  BOARD = 'BOARD',
  GRID = 'GRID',
  LIST = 'LIST',
  WORKLOAD = 'WORKLOAD',
  CALENDAR = 'CALENDAR',
  PEOPLE = 'PEOPLE',
  DASHBOARD = 'DASHBOARD',
}

export enum ZoomLevel {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CLOSED = 'CLOSED',
}

export enum TaskPriority {
  LOWEST = 'LOWEST',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  HIGHEST = 'HIGHEST',
}

export enum ProjectRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export enum GroupByType {
  STATUS = 'STATUS',
  PRIORITY = 'PRIORITY',
  ASSIGNED = 'ASSIGNED',
  NONE = 'NONE',
}

export enum DependencyType {
  FINISH_TO_START = 'FINISH_TO_START',
  START_TO_START = 'START_TO_START',
  FINISH_TO_FINISH = 'FINISH_TO_FINISH',
  START_TO_FINISH = 'START_TO_FINISH',
}

export enum ActivityType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_MOVED = 'TASK_MOVED',
  TASK_PROGRESS = 'TASK_PROGRESS',
  COMMENT_ADDED = 'COMMENT_ADDED',
  FILE_UPLOADED = 'FILE_UPLOADED',
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  STATUS_CHANGED = 'STATUS_CHANGED',
}

export interface Task {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: TaskStatus;
  priority: TaskPriority;
  color: string;
  isMilestone: boolean;
  estimatedHours: number | null;
  loggedHours: number | null;
  sortOrder: number;
  isArchived: boolean;
  projectId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnId: string;
  type: DependencyType;
  createdAt: Date;
}

export interface TaskWithRelations extends Task {
  assignees: ProjectMember[];
  dependencies: TaskDependency[];
  dependents: TaskDependency[];
  parent: Task | null;
  children: Task[];
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  projectId: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string | null;
  extension: string | null;
  taskId: string;
  uploadedById: string;
  projectId: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string | null;
  previous: Record<string, unknown> | null;
  current: Record<string, unknown> | null;
  taskId: string | null;
  projectId: string;
  performedById: string;
  createdAt: Date;
}