import { MuscleCategory } from "@prisma/client";
import { type MantineColor } from "@mantine/core";

const values = Object.values(MuscleCategory);

export function GetMuscleCategoryDisplayString(type: MuscleCategory): string {
  switch (type) {
    case MuscleCategory.ABS:
      return "Abs";
    case MuscleCategory.BACK:
      return "Back";
    case MuscleCategory.CHEST:
      return "Chest";
    case MuscleCategory.ARMS:
      return "Arms";
    case MuscleCategory.LEGS:
      return "Legs";
    case MuscleCategory.SHOULDERS:
      return "Shoulders";
  }
}

export function GetMuscleCategoryValues(): MuscleCategory[] {
  return values;
}

export function GetMuscleCategorySelection(): {
  value: MuscleCategory | "";
  label: string;
}[] {
  return values.map((value) => ({
    value,
    label: GetMuscleCategoryDisplayString(value),
  }));
}

export function GetMuscleCategoryColor(type: MuscleCategory): MantineColor {
  switch (type) {
    case MuscleCategory.ABS:
      return "blue";
    case MuscleCategory.BACK:
      return "green";
    case MuscleCategory.CHEST:
      return "red";
    case MuscleCategory.ARMS:
      return "purple";
    case MuscleCategory.LEGS:
      return "yellow";
    case MuscleCategory.SHOULDERS:
      return "lime";
  }
}

export function IsMuscleCategory(category: string): category is MuscleCategory {
  return values.includes(category as MuscleCategory);
}
