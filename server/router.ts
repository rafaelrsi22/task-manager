import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { tasks } from "./store";
import { publicProcedure, router } from "./trpc";
import type { Task } from "./types";

// offset pagination, simple and enough for an in memory list
const listInput = z.object({
    cursor: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(50).default(10),
});

const taskInput = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional(),
});

// byId, update and delete use this one, so the not found error lives in one place
function findTask(id: string): Task {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
    }

    return task;
}

function getTask({ input }: { input: { id: string } }) {
    return findTask(input.id);
}

function listTasks({ input }: { input: z.infer<typeof listInput> }) {
    const end = input.cursor + input.limit;

    return {
        items: tasks.slice(input.cursor, end),
        nextCursor: end < tasks.length ? end : null,
    };
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
        .input(listInput)
        .query(listTasks),
    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(getTask),
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