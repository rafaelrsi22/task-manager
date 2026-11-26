import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { tasks } from "./store";
import { publicProcedure, router } from "./trpc";
import type { Task } from "./types";

const taskInput = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional(),
});

function findTask(id: string): Task {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
    }

    return task;
}

function listTasks() {
    return tasks;
}

function createTask({ input }: { input: z.infer<typeof taskInput> }) {
    const task: Task = {
        id: randomUUID(),
        title: input.title,
        description: input.description,
        creationDate: new Date(),
    };

    tasks.unshift(task);
    return task;
}

function updateTask({ input }: { input: z.infer<typeof taskInput> & { id: string } }) {
    const task = findTask(input.id);
    task.title = input.title;
    task.description = input.description;

    return task;
}

function deleteTask({ input }: { input: { id: string } }) {
    const task = findTask(input.id);
    tasks.splice(tasks.indexOf(task), 1);

    return task;
}

export const appRouter = router({
    list: publicProcedure
        .query(listTasks),
    create: publicProcedure
        .input(taskInput)
        .mutation(createTask),
    update: publicProcedure
        .input(taskInput.extend({ id: z.string() }))
        .mutation(updateTask),
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(deleteTask),
});

export type AppRouter = typeof appRouter;