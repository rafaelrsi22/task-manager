"use client"

import { Task } from "@/server/types";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Message = { type: "success" | "error"; text: string };
type Page = { items: Task[]; nextCursor: number | null };

export function TaskList({ initialPage, saved }: { initialPage: Page; saved: boolean }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [message, setMessage] = useState<Message | null>(saved ? { type: "success", text: "Task saved" } : null);
    const loaderRef = useRef<HTMLParagraphElement>(null);

    // the first page comes from the server, react query fetches the next ones on scroll
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
        trpc.list.infiniteQueryOptions({}, {
            initialCursor: 0,
            initialData: { pages: [initialPage], pageParams: [0] },
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    );

    const tasks = data.pages.flatMap((page) => page.items);

    // remove ?saved=1 from the url so the message doesn't show again on refresh
    useEffect(() => {
        if (saved) {
            window.history.replaceState(null, "", "/");
        }
    }, [saved]);

    // when "Loading more" shows up on screen fetch the next page
    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        observer.observe(loader);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const deleteTask = useMutation(
        trpc.delete.mutationOptions({
            onSuccess() {
                setMessage({ type: "success", text: "Task deleted" });
                // pathKey because the infinite query key is different from the normal one
                queryClient.invalidateQueries({ queryKey: trpc.list.pathKey() });
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
                            {deleteTask.isPending && deleteTask.variables?.id === task.id ? "Deleting..." : "Delete"}
                        </button>
                    </li>
                ))}
            </ul>

            {hasNextPage && <p ref={loaderRef} className="loading">Loading more...</p>}
        </section>
    );
}
