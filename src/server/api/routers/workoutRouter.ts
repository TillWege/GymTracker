import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { GetDayLimits } from "~/common/gymDay";

export const workoutRouter = createTRPCRouter({
  getWorkouts: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        onlyMine: z.boolean(),
        exerciseId: z.optional(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;
      const data = await ctx.prisma.workout.findMany({
        where: {
          exerciseId: input.exerciseId,
          user: {
            id: input.onlyMine ? ctx.session?.user.id : undefined,
          },
        },
        include: {
          exercise: true,
          day: true,
          sets: true,
          cardioData: true,
        },
        orderBy: {
          day: {
            date: "desc",
          },
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
  addWorkout: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [dayStartDate, dayEndDate] = GetDayLimits(new Date());

      let gymDay = await ctx.prisma.gymDay.findFirst({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: dayStartDate,
            lt: dayEndDate,
          },
        },
      });

      if (!gymDay) {
        gymDay = await ctx.prisma.gymDay.create({
          data: {
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            date: new Date(),
          },
        });
      }

      return await ctx.prisma.workout.create({
        data: {
          day: {
            connect: {
              id: gymDay.id,
            },
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
  addRound: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        data: z.array(
          z.object({
            distance: z.number(),
            time: z.number(),
            intensity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await Promise.all(
        input.data.map(async (round) => {
          return ctx.prisma.cardioData.create({
            data: {
              distance: round.distance,
              time: round.time,
              intensity: round.intensity,
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
  deleteRound: protectedProcedure
    .input(z.object({ roundId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.cardioData.delete({
        where: {
          id: input.roundId,
          workout: {
            user: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
