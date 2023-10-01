import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const dayRouter = createTRPCRouter({
  getDays: publicProcedure
    .input(
      z.object({ userId: z.optional(z.string()), cursor: z.string().nullish() })
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;
      const data = await ctx.prisma.gymDay.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
          workout: {
            include: {
              exercise: true,
              sets: true,
              cardioData: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1,
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        nextCursor = nextItem!.id;
      }
      return {
        data,
        nextCursor,
      };
    }),

  deleteDay: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.gymDay.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
