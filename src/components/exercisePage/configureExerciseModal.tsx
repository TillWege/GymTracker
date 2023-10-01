import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { useEffect } from "react";
import {
  GetExerciseTypeSelection,
  IsExerciseType,
} from "~/common/exerciseType";
import {
  GetMuscleCategorySelection,
  IsMuscleCategory,
} from "~/common/muscleCategory";
import { GetMuscleGroupSelection, IsMuscleGroup } from "~/common/muscleGroup";
import { Button, Group, Modal, NativeSelect, TextInput } from "@mantine/core";
import {
  type ExerciseType,
  type MuscleCategory,
  type MuscleGroup,
} from "@prisma/client";
import { type Exercise } from ".prisma/client";

interface ConfigureExerciseModalProps {
  opened: boolean;
  onClose: () => void;
  existingExercise?: Exercise;
}

interface ConfigureExerciseModalFormValues {
  name: string;
  muscleCategory: MuscleCategory | "";
  muscleGroup: MuscleGroup | "";
  exerciseType: ExerciseType | "";
}

export function ConfigureExerciseModal({
  opened,
  onClose: close,
  existingExercise,
}: ConfigureExerciseModalProps) {
  const form = useForm<ConfigureExerciseModalFormValues>({
    initialValues: {
      name: existingExercise?.name ?? "",
      exerciseType: existingExercise?.exerciseType ?? "",
      muscleGroup: existingExercise?.muscleGroup ?? "",
      muscleCategory: existingExercise?.muscleCategory ?? "",
    },
    validate: {
      name: (value) => value.trim().length == 0,
      exerciseType: (value) => value == "",
      muscleCategory: (value) => value == "",
    },
  });
  const addMutation = api.exercise.addExercise.useMutation();
  const updateMutation = api.exercise.updateExercise.useMutation();
  const context = api.useContext();

  useEffect(() => {
    form.reset();
  }, [opened]);

  const submitHandler = async (values: ConfigureExerciseModalFormValues) => {
    if (existingExercise) {
      await updateExercise(values);
    } else {
      await createExercise(values);
    }
    await context.exercise.getExercises.invalidate();
    close();
  };

  const createExercise = async (values: ConfigureExerciseModalFormValues) => {
    if (
      IsExerciseType(values.exerciseType) &&
      IsMuscleCategory(values.muscleCategory)
    ) {
      await addMutation.mutateAsync({
        name: values.name,
        muscleCategory: values.muscleCategory,
        muscleGroup: IsMuscleGroup(values.muscleGroup)
          ? values.muscleGroup
          : undefined,
        exerciseType: values.exerciseType,
      });
    }
  };

  const updateExercise = async (values: ConfigureExerciseModalFormValues) => {
    if (
      IsExerciseType(values.exerciseType) &&
      IsMuscleCategory(values.muscleCategory)
    ) {
      await updateMutation.mutateAsync({
        id: existingExercise?.id ?? "",
        name: values.name,
        muscleCategory: values.muscleCategory,
        muscleGroup: IsMuscleGroup(values.muscleGroup)
          ? values.muscleGroup
          : undefined,
        exerciseType: values.exerciseType,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${existingExercise ? "Update" : "Create new"} Exercise`}
    >
      <form onSubmit={form.onSubmit((values) => void submitHandler(values))}>
        <TextInput
          label={"Exercise Name"}
          {...form.getInputProps("name")}
          withAsterisk
        />
        <NativeSelect
          data={GetMuscleCategorySelection()}
          label={"Select Muscle Category"}
          placeholder={"Muscle Category"}
          {...form.getInputProps("muscleCategory")}
          withAsterisk
        />
        <NativeSelect
          data={GetMuscleGroupSelection()}
          label={"Select Muscle Group"}
          placeholder={"Muscle Group"}
          {...form.getInputProps("muscleGroup")}
        />
        <NativeSelect
          data={GetExerciseTypeSelection()}
          label={"Select Exercise Type"}
          withAsterisk
          placeholder={"Exercise Type"}
          {...form.getInputProps("exerciseType")}
        />
        <Group justify="center" mt={"md"}>
          <Button onClick={close} type={"reset"} color={"red"}>
            Cancel
          </Button>
          <Button type={"submit"}>
            {existingExercise ? "Update" : "Add"} Exercise
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
