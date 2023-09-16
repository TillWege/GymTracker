import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const exerciseRouter = createTRPCRouter({
  getExercises: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.exercise.findMany();
  }),
  addExercise: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {}),
});
