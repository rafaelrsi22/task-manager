import Link from "next/link";
import { caller } from "@/server/caller";
import { TaskList } from "./task-list";

// render on every request, the list changes all the time so it can't be a static page from the build
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const firstPage = await caller.list({});

  return (
    <main>
      <h1>Tasks</h1>
      <Link href="/tasks/new">New task</Link>
      <TaskList initialPage={firstPage} saved={saved === "1"} />
    </main>
  );
}