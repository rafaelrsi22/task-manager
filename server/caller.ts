import { appRouter } from "./router";
import { createCallerFactory } from "./trpc";

export const caller = createCallerFactory(appRouter)({});