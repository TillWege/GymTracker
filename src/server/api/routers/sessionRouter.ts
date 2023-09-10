import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  getSessions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workoutSession.findMany();
  }),

  startSession: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.workoutSession.create({
      data: {
        timestamp: new Date(),
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
});
