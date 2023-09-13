const muscleGroups = ["Arms", "Chest"] as const;

type MuscleGroup = (typeof muscleGroups)[number];
