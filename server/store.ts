import type { Task } from "./types";

// no dev o next recarrega os modulos a cada save, entao a lista fica no globalThis pra nao zerar
const globalForTasks = globalThis as unknown as { tasks: Task[] | undefined };

if (!globalForTasks.tasks) {
    globalForTasks.tasks = [];
}

export const tasks = globalForTasks.tasks;