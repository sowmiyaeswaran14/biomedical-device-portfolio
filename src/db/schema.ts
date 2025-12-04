import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Equipment table
export const equipment = sqliteTable('equipment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  model: text('model'),
  serialNumber: text('serial_number').unique(),
  manufacturer: text('manufacturer'),
  category: text('category'),
  location: text('location'),
  status: text('status').notNull().default('operational'),
  purchaseDate: integer('purchase_date'),
  warrantyExpiry: integer('warranty_expiry'),
  lastMaintenance: integer('last_maintenance'),
  nextMaintenance: integer('next_maintenance'),
  notes: text('notes'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Maintenance Schedules table
export const maintenanceSchedules = sqliteTable('maintenance_schedules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  equipmentId: integer('equipment_id').notNull().references(() => equipment.id),
  title: text('title').notNull(),
  description: text('description'),
  frequency: text('frequency'),
  frequencyDays: integer('frequency_days'),
  lastPerformed: integer('last_performed'),
  nextDue: integer('next_due'),
  priority: text('priority').notNull().default('medium'),
  estimatedDuration: integer('estimated_duration'),
  assignedTo: text('assigned_to'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Maintenance Logs table
export const maintenanceLogs = sqliteTable('maintenance_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  equipmentId: integer('equipment_id').notNull().references(() => equipment.id),
  scheduleId: integer('schedule_id').references(() => maintenanceSchedules.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  performedBy: text('performed_by').notNull(),
  performedAt: integer('performed_at').notNull(),
  duration: integer('duration'),
  status: text('status').notNull().default('completed'),
  partsReplaced: text('parts_replaced', { mode: 'json' }),
  cost: real('cost'),
  notes: text('notes'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Work Orders table
export const workOrders = sqliteTable('work_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  equipmentId: integer('equipment_id').notNull().references(() => equipment.id),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('pending'),
  type: text('type').notNull(),
  reportedBy: text('reported_by'),
  assignedTo: text('assigned_to'),
  createdAt: integer('created_at').notNull(),
  scheduledDate: integer('scheduled_date'),
  completedDate: integer('completed_date'),
  estimatedCost: real('estimated_cost'),
  actualCost: real('actual_cost'),
  notes: text('notes'),
  updatedAt: integer('updated_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});