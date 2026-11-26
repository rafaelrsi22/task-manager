# Task Manager

Task CRUD built with Next.js 15 and tRPC for the technical case. Tasks are kept in memory, so they are gone when the server restarts.

## Running

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How it works

- The backend is a tRPC router in `server/router.ts` with `list`, `byId`, `create`, `update` and `delete`, and every input is validated with Zod.
- The list page is rendered on the server and already comes with the first page. The rest loads with infinite scroll, 10 at a time.
- The same form is used to create and edit. The title is validated on the front and again on the back.
- Backend errors, like an empty title or a task that doesn't exist, show up on the screen.

The fields are `title`, `description` and `creationDate`, which match `titulo`, `descricao` and `dataCriacao` from the case.