import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { useEffect } from "react";

import { type ComboboxItem } from "@mantine/core/lib/components/Combobox/Combobox.types";
import { Button, Group, Modal, NativeSelect } from "@mantine/core";

interface AddWorkoutForm {
  exercise: string;
}

interface AddWorkoutModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AddWorkoutModal({ opened, onClose }: AddWorkoutModalProps) {
  const form = useForm<AddWorkoutForm>({
    initialValues: {
      exercise: "",
    },
    validate: {
      exercise: (value) => value == "",
    },
  });
  const addMut = api.workout.addWorkout.useMutation();
  const context = api.useContext();
  const { data: exercises } = api.exercise.getExercises.useQuery();

  useEffect(() => {
    form.reset();
  }, [opened]);

  const addWorkout = async (values: AddWorkoutForm) => {
    await addMut.mutateAsync({
      exerciseId: values.exercise,
    });
    await context.workout.getWorkouts.invalidate();
    onClose();
  };

  const exerciseOptions: ComboboxItem[] = [
    { value: "", label: "Select Exercise" },
    ...(exercises?.map((exercise) => {
      return {
        label: exercise.name,
        value: exercise.id,
      };
    }) ?? []),
  ];
  return (
    <Modal opened={opened} onClose={onClose} title={"Start new Workout"}>
      <form
        onSubmit={form.onSubmit((values) => {
          void addWorkout(values);
        })}
      >
        <NativeSelect
          label={"Select Exercise"}
          placeholder={"Exercise"}
          data={exerciseOptions}
          withAsterisk
          {...form.getInputProps("exercise")}
        />
        <Group justify="center" mt={"md"}>
          <Button onClick={onClose} type={"reset"} color={"red"}>
            Cancel
          </Button>
          <Button type={"submit"}>Start Workout</Button>
        </Group>
      </form>
    </Modal>
  );
}
