import Link from "next/link";

export default function NotFound() {
    return (
        <main>
            <Link href="/">Back</Link>
            <h1>Not found</h1>
            <p className="error">This task does not exist or was deleted.</p>
        </main>
    );
}
