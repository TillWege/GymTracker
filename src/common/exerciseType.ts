import { ExerciseType } from "@prisma/client";

const values = Object.values(ExerciseType);

export function GetExerciseTypeDisplayString(type: ExerciseType): string {
  switch (type) {
    case ExerciseType.FREE_WEIGHT:
      return "Cardio";
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
    { value: "", label: "All" },
    ...values.map((value) => ({
      value,
      label: GetExerciseTypeDisplayString(value),
    })),
  ];
}
