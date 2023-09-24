import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import {
  type ExerciseType,
  type MuscleCategory,
  type MuscleGroup,
} from "@prisma/client";
import { api } from "~/utils/api";
import { useState } from "react";
import { ExerciseCard } from "~/components/exercisePage/exerciseCard";
import { ExerciseFilterButton } from "~/components/exercisePage/exerciseFilterButton";
import { ConfigureExerciseModal } from "~/components/exercisePage/configureExerciseModal";

export default function Exercise() {
  const [opened, { open, close }] = useDisclosure(false);
  const [exerciseTypeFilters, setExerciseTypeFilters] = useState<
    ExerciseType[]
  >([]);
  const [muscleCategoryFilters, setMuscleCategoryFilters] = useState<
    MuscleCategory[]
  >([]);
  const [muscleGroupFilters, setMuscleGroupFilters] = useState<MuscleGroup[]>(
    []
  );
  const { data } = api.exercise.getExercises.useQuery({
    exerciseTypeFilter: exerciseTypeFilters,
    muscleCategoryFilter: muscleCategoryFilters,
    muscleGroupFilter: muscleGroupFilters,
  });

  return (
    <PageWithFab
      onFabClick={open}
      fabCaption={"Add Exercise"}
      pageTitle={"Exercise List"}
      titleChildren={
        <ExerciseFilterButton
          exerciseTypeFilters={exerciseTypeFilters}
          muscleCategoryFilters={muscleCategoryFilters}
          muscleGroupFilters={muscleGroupFilters}
          setExerciseTypeFilters={setExerciseTypeFilters}
          setMuscleCategoryFilters={setMuscleCategoryFilters}
          setMuscleGroupFilters={setMuscleGroupFilters}
        />
      }
    >
      {data?.map((exercise) => (
        <ExerciseCard key={exercise.id} {...exercise}></ExerciseCard>
      ))}
      <ConfigureExerciseModal
        opened={opened}
        onClose={close}
      ></ConfigureExerciseModal>
    </PageWithFab>
  );
}
