const exerciseTypes = ["Machine", "Freeweight"] as const;

type ExerciseType = (typeof exerciseTypes)[number];

const exerciseTypeMapping: Record<ExerciseType, number> = {
  Machine: 1,
  Freeweight: 2,
};

function getExerciseTypeID(exerciseType: ExerciseType): number {
  return exerciseTypeMapping[exerciseType];
}

function getExerciseTypeByID(id: number): ExerciseType | undefined {
  exerciseTypes.forEach((exerciseType) => {
    if (exerciseTypeMapping[exerciseType] === id) {
      return exerciseType;
    }
  });
  return undefined;
}
