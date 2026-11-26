import { appRouter } from "./router";
import { createCallerFactory } from "./trpc";

// chama o router direto no servidor, sem passar por http, eh o q as paginas usam no SSR
export const caller = createCallerFactory(appRouter)({});