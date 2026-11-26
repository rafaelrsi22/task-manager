import Link from "next/link";
import { caller } from "@/server/caller";
import { TaskList } from "./task-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks = await caller.list();

  return (
    <main>
      <h1>Tasks</h1>
      <Link href="/tasks/new">New task</Link>
      <TaskList initialTasks={tasks} />
    </main>
  );
}