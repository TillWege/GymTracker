import { MuscleGroup } from "@prisma/client";
import { GetMuscleCategoryDisplayString } from "~/common/muscleCategory";

const values = Object.values(MuscleGroup);

export function GetMuscleGroupDisplayString(type: MuscleGroup): string {
  switch (type) {
    case MuscleGroup.ABS_LOWER:
      return "Abs (Lower)";
    case MuscleGroup.ABS_UPPER:
      return "Abs (Upper)";
    case MuscleGroup.BACK_LOWER:
      return "Back (Lower)";
    case MuscleGroup.BACK_UPPER:
      return "Back (Upper)";
    case MuscleGroup.BICEPS:
      return "Biceps";
    case MuscleGroup.CALVES:
      return "Calves";
    case MuscleGroup.HAMSTRINGS:
      return "Hamstrings";
    case MuscleGroup.QUADS:
      return "Quads";
    case MuscleGroup.SHOULDERS_BACK:
      return "Shoulders (Back)";
    case MuscleGroup.SHOULDERS_FRONT:
      return "Shoulders (Front)";
    case MuscleGroup.TRICEPS:
      return "Triceps";
    case MuscleGroup.CHEST_LOWER:
      return "Chest (Lower)";
    case MuscleGroup.CHEST_UPPER:
      return "Chest (Upper)";
  }
}

export function GetMuscleGroupValues(): MuscleGroup[] {
  return values;
}

export function GetMuscleGroupSelection(): {
  value: MuscleGroup | "";
  label: string;
}[] {
  return [
    { value: "", label: "All" },
    ...values.map((value) => ({
      value,
      label: GetMuscleGroupDisplayString(value),
    })),
  ];
}
