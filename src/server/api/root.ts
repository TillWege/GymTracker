import { createTRPCRouter } from "~/server/api/trpc";
import { sessionRouter } from "~/server/api/routers/sessionRouter";
import { exerciseRouter } from "~/server/api/routers/exerciseRouter";
import { workoutRouter } from "~/server/api/routers/workoutRouter";

export const appRouter = createTRPCRouter({
  session: sessionRouter,
  exercise: exerciseRouter,
  workout: workoutRouter,
});

export type AppRouter = typeof appRouter;
