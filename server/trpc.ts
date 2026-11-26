import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

const t = initTRPC.create({
    // superjson so Date gets to the client as a Date and not a string
    transformer: superjson,
    // send only the zod message (like "Title is required") instead of the whole issues json
    errorFormatter({shape, error}) {
        if (error.cause instanceof ZodError) {
            return {...shape, message: error.cause.issues[0].message};
        }

        return shape;
    },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;