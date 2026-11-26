import type { Task } from "./types";

const globalForTasks = globalThis as unknown as { tasks: Task[] | undefined };

if (!globalForTasks.tasks) {
    globalForTasks.tasks = [];
}

export const tasks = globalForTasks.tasks;