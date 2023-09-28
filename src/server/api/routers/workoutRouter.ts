import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const workoutRouter = createTRPCRouter({
  getWorkouts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workout.findMany({
      include: {
        exercise: true,
        session: true,
        sets: true,
      },
    });
  }),
  addWorkout: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        sessionId: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createInfo = {
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        startTimestamp: new Date(),
      };

      const connectInfo = {
        id: input.sessionId,
      };

      return await ctx.prisma.workout.create({
        data: {
          session: {
            create: input.sessionId ? undefined : createInfo,
            connect: input.sessionId ? connectInfo : undefined,
          },
          exercise: {
            connect: {
              id: input.exerciseId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  deleteWorkout: protectedProcedure
    .input(z.object({ workoutId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.workout.delete({
        where: {
          id: input.workoutId,
          user: {
            id: ctx.session.user.id,
          },
        },
      });
    }),

  addSet: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        data: z.array(
          z.object({
            weight: z.number(),
            repCount: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workout = await ctx.prisma.workout.findUnique({
        where: {
          id: input.workoutId,
          user: {
            id: ctx.session.user.id,
          },
        },
      });

      if (!workout) {
        throw new Error("Workout not found");
      }

      return await Promise.all(
        input.data.map(async (set) => {
          return await ctx.prisma.set.create({
            data: {
              weight: set.weight,
              reps: set.repCount,
              workout: {
                connect: {
                  id: input.workoutId,
                },
              },
            },
          });
        })
      );
    }),
  deleteSet: protectedProcedure
    .input(z.object({ setId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.set.delete({
        where: {
          id: input.setId,
          workout: {
            user: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  getPRSet: publicProcedure
    .input(z.object({ exerciseId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.set.findFirst({
        where: {
          workout: {
            exercise: {
              id: input.exerciseId,
            },
          },
        },
        orderBy: {
          weight: "desc",
        },
      });
    }),
});
