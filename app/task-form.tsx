"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Task } from "@/server/types";
import { useTRPC } from "@/trpc/client";

export function TaskForm({ task }: { task?: Task }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [error, setError] = useState("");

    const mutationOptions = {
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: trpc.list.queryKey() });
            router.push("/?saved=1");
        },
        onError(error: { message: string }) {
            setError(error.message);
        },
    };

    const createTask = useMutation(trpc.create.mutationOptions(mutationOptions));
    const updateTask = useMutation(trpc.update.mutationOptions(mutationOptions));
    const isSaving = createTask.isPending || updateTask.isPending;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setError("");

        if (task) {
            updateTask.mutate({ id: task.id, title, description });
        } else {
            createTask.mutate({ title, description });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title
                <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>

            <label>
                Description
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
            </button>
        </form>
    );
}