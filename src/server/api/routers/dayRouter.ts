import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const dayRouter = createTRPCRouter({
  getDays: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.gymDay.findMany();
  }),
  getDaysByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.gymDay.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
    });
  }),
});
