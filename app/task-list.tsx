"use client"

import { Task } from "@/server/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

type Message = { type: "success" | "error"; text: string };

export function TaskList({ initialTasks, saved }: { initialTasks: Task[]; saved: boolean }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [message, setMessage] = useState<Message | null>(saved ? { type: "success", text: "Task saved" } : null);

    const { data: tasks } = useQuery(
        trpc.list.queryOptions(undefined, { initialData: initialTasks }),
    );

    const deleteTask = useMutation(
        trpc.delete.mutationOptions({
            onSuccess() {
                setMessage({ type: "success", text: "Task deleted" });
                queryClient.invalidateQueries({ queryKey: trpc.list.queryKey() });
            },
            onError(error) {
                setMessage({ type: "error", text: error.message })
            }
        })
    );

    return (
        <section>
            {message && <p className={message.type}>{message.text}</p>}

            {tasks.length === 0 && <p>No tasks yet.</p>}

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <h2>{task.title}</h2>
                        {task.description && <p>{task.description}</p>}
                        <small>{task.creationDate.toLocaleString()}</small>
                        <Link href={`/tasks/${task.id}/edit`}>Edit</Link>
                        <button
                            onClick={() => deleteTask.mutate({ id: task.id })}
                            disabled={deleteTask.isPending}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}