import { createTRPCRouter } from "~/server/api/trpc";
import { dayRouter } from "~/server/api/routers/dayRouter";
import { exerciseRouter } from "~/server/api/routers/exerciseRouter";
import { workoutRouter } from "~/server/api/routers/workoutRouter";
import { userRouter } from "~/server/api/routers/userRouter";

export const appRouter = createTRPCRouter({
  day: dayRouter,
  exercise: exerciseRouter,
  workout: workoutRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
