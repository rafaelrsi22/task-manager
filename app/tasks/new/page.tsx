import Link from "next/link";
import { TaskForm } from "@/app/task-form";

export default function NewTaskPage() {
    return (
        <main>
            <Link href="/">Back</Link>
            <h1>New task</h1>
            <TaskForm />
        </main>
    );
}