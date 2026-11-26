import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskForm } from "@/app/task-form";
import { caller } from "@/server/caller";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const task = await caller.byId({ id }).catch(() => null);

    if (!task) {
        notFound();
    }

    return (
        <main>
            <Link href="/">Back</Link>
            <h1>Edit task</h1>
            <TaskForm task={task} />
        </main>
    );
}