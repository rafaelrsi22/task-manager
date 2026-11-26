import type { Task } from "./types";

// in dev next reloads the modules on every save, so the list lives on globalThis to not reset
const globalForTasks = globalThis as unknown as { tasks: Task[] | undefined };

if (!globalForTasks.tasks) {
    globalForTasks.tasks = [];
}

export const tasks = globalForTasks.tasks;