import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

const t = initTRPC.create({
    // superjson pra Date chegar como Date no front e nao como string
    transformer: superjson,
    // manda so a mensagem do zod (tipo "Title is required") em vez do json inteiro dos issues
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