import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import {
  type ExerciseType,
  type MuscleCategory,
  type MuscleGroup,
} from "@prisma/client";
import { Badge, Button, Divider, Group, Modal, Text } from "@mantine/core";
import {
  GetExerciseTypeColor,
  GetExerciseTypeDisplayString,
  GetExerciseTypeValues,
} from "~/common/exerciseType";
import {
  GetMuscleCategoryColor,
  GetMuscleCategoryDisplayString,
  GetMuscleCategoryValues,
} from "~/common/muscleCategory";
import {
  GetMuscleGroupColor,
  GetMuscleGroupDisplayString,
  GetMuscleGroupValues,
} from "~/common/muscleGroup";

interface ExerciseFilterButtonProps {
  exerciseTypeFilters: ExerciseType[];
  muscleCategoryFilters: MuscleCategory[];
  muscleGroupFilters: MuscleGroup[];
  setExerciseTypeFilters: (filters: ExerciseType[]) => void;
  setMuscleCategoryFilters: (filters: MuscleCategory[]) => void;
  setMuscleGroupFilters: (filters: MuscleGroup[]) => void;
}

export function ExerciseFilterButton({
  exerciseTypeFilters,
  muscleCategoryFilters,
  muscleGroupFilters,
  setExerciseTypeFilters,
  setMuscleCategoryFilters,
  setMuscleGroupFilters,
}: ExerciseFilterButtonProps) {
  const [filterOpen, { toggle, close: closeFilter }] = useDisclosure(false);

  const [tempExerciseTypeFilters, setTempExerciseTypeFilters] = useState<
    ExerciseType[]
  >([]);
  const [tempMuscleCategoryFilters, setTempMuscleCategoryFilters] = useState<
    MuscleCategory[]
  >([]);
  const [tempMuscleGroupFilters, setTempMuscleGroupFilters] = useState<
    MuscleGroup[]
  >([]);

  const showFilters = () => {
    setTempExerciseTypeFilters(exerciseTypeFilters);
    setTempMuscleCategoryFilters(muscleCategoryFilters);
    setTempMuscleGroupFilters(muscleGroupFilters);
    toggle();
  };

  const resetFilters = () => {
    setTempExerciseTypeFilters([]);
    setTempMuscleCategoryFilters([]);
    setTempMuscleGroupFilters([]);
  };

  const applyFilters = () => {
    setExerciseTypeFilters(tempExerciseTypeFilters);
    setMuscleCategoryFilters(tempMuscleCategoryFilters);
    setMuscleGroupFilters(tempMuscleGroupFilters);
    closeFilter();
  };

  return (
    <>
      <Button onClick={showFilters}>Configure Filters</Button>
      <Modal
        opened={filterOpen}
        onClose={closeFilter}
        title={"Configure Filters"}
      >
        <Text>Exercise Type</Text>
        {GetExerciseTypeValues().map((type, index) => (
          <Badge
            key={`type-${index}`}
            style={{ cursor: "pointer", userSelect: "none" }}
            color={
              tempExerciseTypeFilters.includes(type)
                ? GetExerciseTypeColor(type)
                : "gray"
            }
            onClick={() => {
              if (tempExerciseTypeFilters.includes(type)) {
                setTempExerciseTypeFilters(
                  tempExerciseTypeFilters.filter((x) => x != type)
                );
              } else {
                setTempExerciseTypeFilters([...tempExerciseTypeFilters, type]);
              }
            }}
          >
            {GetExerciseTypeDisplayString(type)}
          </Badge>
        ))}
        <Divider mt={"sm"} mb={"sm"} />
        <Text>Muscle Category</Text>
        {GetMuscleCategoryValues().map((category, index) => (
          <Badge
            key={`category-${index}`}
            style={{ cursor: "pointer", userSelect: "none" }}
            color={
              tempMuscleCategoryFilters.includes(category)
                ? GetMuscleCategoryColor(category)
                : "gray"
            }
            onClick={() => {
              if (tempMuscleCategoryFilters.includes(category)) {
                setTempMuscleCategoryFilters(
                  tempMuscleCategoryFilters.filter((x) => x != category)
                );
              } else {
                setTempMuscleCategoryFilters([
                  ...tempMuscleCategoryFilters,
                  category,
                ]);
              }
            }}
          >
            {GetMuscleCategoryDisplayString(category)}
          </Badge>
        ))}
        <Divider mt={"sm"} mb={"sm"} />
        <Text>Muscle Group</Text>
        {GetMuscleGroupValues().map((group, index) => (
          <Badge
            style={{ cursor: "pointer", userSelect: "none" }}
            key={`group-${index}`}
            color={
              tempMuscleGroupFilters.includes(group)
                ? GetMuscleGroupColor(group)
                : "gray"
            }
            onClick={() => {
              if (tempMuscleGroupFilters.includes(group)) {
                setTempMuscleGroupFilters(
                  tempMuscleGroupFilters.filter((x) => x != group)
                );
              } else {
                setTempMuscleGroupFilters([...tempMuscleGroupFilters, group]);
              }
            }}
          >
            {GetMuscleGroupDisplayString(group)}
          </Badge>
        ))}
        <Divider mt={"sm"} mb={"sm"} />
        <Group justify={"center"}>
          <Button onClick={resetFilters} type={"reset"} color={"red"}>
            Clear Filters
          </Button>
          <Button type={"submit"} onClick={applyFilters}>
            Apply Filters
          </Button>
        </Group>
      </Modal>
    </>
  );
}
