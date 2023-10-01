import { MuscleCategory, MuscleGroup } from "@prisma/client";
import { GetMuscleCategoryColor } from "~/common/muscleCategory";
import { type MantineColor } from "@mantine/core";

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
    { value: "", label: "Please Select..." },
    ...values.map((value) => ({
      value,
      label: GetMuscleGroupDisplayString(value),
    })),
  ];
}

export function GetFilteredMuscleGroupSelection(category: MuscleCategory): {
  value: MuscleGroup | "";
  label: string;
}[] {
  return GetMuscleGroupSelection().filter((group) => {
    if (group.value === "") {
      return true;
    } else {
      return GetCategoryFromGroup(group.value) === category;
    }
  });
}

export function GetCategoryFromGroup(group: MuscleGroup): MuscleCategory {
  switch (group) {
    case MuscleGroup.ABS_LOWER:
    case MuscleGroup.ABS_UPPER:
      return MuscleCategory.ABS;
    case MuscleGroup.BACK_LOWER:
    case MuscleGroup.BACK_UPPER:
      return MuscleCategory.BACK;
    case MuscleGroup.BICEPS:
    case MuscleGroup.TRICEPS:
      return MuscleCategory.ARMS;
    case MuscleGroup.CALVES:
    case MuscleGroup.HAMSTRINGS:
    case MuscleGroup.QUADS:
      return MuscleCategory.LEGS;
    case MuscleGroup.SHOULDERS_BACK:
    case MuscleGroup.SHOULDERS_FRONT:
      return MuscleCategory.SHOULDERS;
    case MuscleGroup.CHEST_LOWER:
    case MuscleGroup.CHEST_UPPER:
      return MuscleCategory.CHEST;
  }
}

export function GetMuscleGroupColor(type: MuscleGroup): MantineColor {
  return GetMuscleCategoryColor(GetCategoryFromGroup(type));
}

export function IsMuscleGroup(group: string): group is MuscleGroup {
  return values.includes(group as MuscleGroup);
}
