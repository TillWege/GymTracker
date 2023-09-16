import { MuscleCategory } from "@prisma/client";

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
    { value: "", label: "All" },
    ...values.map((value) => ({
      value,
      label: GetMuscleCategoryDisplayString(value),
    })),
  ];
}
