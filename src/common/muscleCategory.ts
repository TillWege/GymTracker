import { MuscleCategory, MuscleGroup } from "@prisma/client";

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
  return [
    { value: "", label: "Select category..." },
    ...values.map((value) => ({
      value,
      label: GetMuscleCategoryDisplayString(value),
    })),
  ];
}

export function IsMuscleCategory(category: string): category is MuscleCategory {
  return values.includes(category as MuscleCategory);
}
