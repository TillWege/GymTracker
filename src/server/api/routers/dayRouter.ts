import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const dayRouter = createTRPCRouter({
  getDays: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.gymDay.findMany({
      include: {
        user: true,
      },
    });
  }),
  getDaysByUser: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gymDay.findMany({
        where: {
          userId: input,
        },
        include: {
          user: true,
        },
      });
    }),
});
