CREATE TABLE `equipment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`model` text,
	`serial_number` text,
	`manufacturer` text,
	`category` text,
	`location` text,
	`status` text DEFAULT 'operational' NOT NULL,
	`purchase_date` integer,
	`warranty_expiry` integer,
	`last_maintenance` integer,
	`next_maintenance` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `equipment_serial_number_unique` ON `equipment` (`serial_number`);--> statement-breakpoint
CREATE TABLE `maintenance_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`equipment_id` integer NOT NULL,
	`schedule_id` integer,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`performed_by` text NOT NULL,
	`performed_at` integer NOT NULL,
	`duration` integer,
	`status` text DEFAULT 'completed' NOT NULL,
	`parts_replaced` text,
	`cost` real,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`schedule_id`) REFERENCES `maintenance_schedules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `maintenance_schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`equipment_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`frequency` text,
	`frequency_days` integer,
	`last_performed` integer,
	`next_due` integer,
	`priority` text DEFAULT 'medium' NOT NULL,
	`estimated_duration` integer,
	`assigned_to` text,
	`is_active` integer DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `work_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`equipment_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`type` text NOT NULL,
	`reported_by` text,
	`assigned_to` text,
	`created_at` integer NOT NULL,
	`scheduled_date` integer,
	`completed_date` integer,
	`estimated_cost` real,
	`actual_cost` real,
	`notes` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action
);
