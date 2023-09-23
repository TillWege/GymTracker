import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const sessionRouter = createTRPCRouter({
  getSessions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workoutSession.findMany();
  }),
  getSessionsByUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workoutSession.findMany({
      where: {
        user: {
          id: ctx.session.user.id,
        },
      },
      orderBy: {
        startTimestamp: "desc",
      },
      take: 10,
    });
  }),

  startSession: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.workoutSession.create({
      data: {
        startTimestamp: new Date(),
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  endSession: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.workoutSession.update({
        where: {
          id: input,
          user: {
            id: ctx.session.user.id,
          },
        },
        data: {
          endTimestamp: new Date(),
        },
      });
    }),
});
