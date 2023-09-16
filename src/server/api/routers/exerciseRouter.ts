import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { ExerciseType, MuscleCategory, MuscleGroup } from "@prisma/client";

export const exerciseRouter = createTRPCRouter({
  getExercises: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.exercise.findMany();
  }),
  addExercise: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        exerciseType: z.nativeEnum(ExerciseType),
        muscleCategory: z.nativeEnum(MuscleCategory),
        muscleGroup: z.union([z.nativeEnum(MuscleGroup), z.undefined()]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.exercise.create({
        data: {
          name: input.name,
          exerciseType: input.exerciseType,
          muscleGroup: input.muscleGroup,
          muscleCategory: input.muscleCategory,
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  deleteExercise: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.exercise.delete({
        where: {
          id: input,
          creator: {
            id: ctx.session.user.id,
          },
        },
      });
    }),
  updateExercise: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        exerciseType: z.nativeEnum(ExerciseType),
        muscleCategory: z.nativeEnum(MuscleCategory),
        muscleGroup: z.nativeEnum(MuscleGroup),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.exercise.update({
        where: {
          id: input.id,
          creator: {
            id: ctx.session.user.id,
          },
        },
        data: {
          name: input.name,
          exerciseType: input.exerciseType,
          muscleGroup: input.muscleGroup,
          muscleCategory: input.muscleCategory,
        },
      });
    }),
});
