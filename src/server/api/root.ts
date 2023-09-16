import { createTRPCRouter } from "~/server/api/trpc";
import { sessionRouter } from "~/server/api/routers/sessionRouter";
import { exerciseRouter } from "~/server/api/routers/exerciseRouter";

export const appRouter = createTRPCRouter({
  session: sessionRouter,
  exercise: exerciseRouter,
});

export type AppRouter = typeof appRouter;
