import { appRouter } from "./router";
import { createCallerFactory } from "./trpc";

// calls the router straight on the server without http, this is what the pages use for SSR
export const caller = createCallerFactory(appRouter)({});