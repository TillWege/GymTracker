import { ExerciseType, MuscleCategory } from "@prisma/client";
import { MantineColor } from "@mantine/core";

const values = Object.values(ExerciseType);

export function GetExerciseTypeDisplayString(type: ExerciseType): string {
  switch (type) {
    case ExerciseType.FREE_WEIGHT:
      return "Free Weight";
    case ExerciseType.MACHINE:
      return "Machine";
  }
}

export function GetExerciseTypeValues(): ExerciseType[] {
  return values;
}

export function GetExerciseTypeSelection(): {
  value: ExerciseType | "";
  label: string;
}[] {
  return [
    { value: "", label: "Select type... " },
    ...values.map((value) => ({
      value,
      label: GetExerciseTypeDisplayString(value),
    })),
  ];
}

export function GetExerciseTypeColor(type: ExerciseType): MantineColor {
  switch (type) {
    case ExerciseType.FREE_WEIGHT:
      return "blue";
    case ExerciseType.MACHINE:
      return "red";
  }
}

export function IsExerciseType(
  exerciseType: string
): exerciseType is ExerciseType {
  return values.includes(exerciseType as ExerciseType);
}
