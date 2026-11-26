import Link from "next/link";
import { caller } from "@/server/caller";
import { TaskList } from "./task-list";

// renderiza a cada request, a lista muda toda hora entao nao pode virar pagina estatica no build
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