import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { GetSessionCaption } from "~/common/gymsession";
import { type ComboboxItem } from "@mantine/core/lib/components/Combobox/Combobox.types";
import { Button, Group, Modal, Select } from "@mantine/core";

interface AddWorkoutForm {
  session: string;
  exercise: string;
}

interface AddWorkoutModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AddWorkoutModal({ opened, onClose }: AddWorkoutModalProps) {
  const form = useForm<AddWorkoutForm>({
    initialValues: {
      session: "",
      exercise: "",
    },
    validate: {
      session: (value) => value == "",
      exercise: (value) => value == "",
    },
  });
  const addMut = api.workout.addWorkout.useMutation();
  const context = api.useContext();
  const { data: sessions } = api.session.getSessionsByUser.useQuery();
  const { data: exercises } = api.exercise.getExercises.useQuery();

  useEffect(() => {
    form.reset();
  }, [opened]);

  const addWorkout = async (values: AddWorkoutForm) => {
    await addMut.mutateAsync({
      sessionId: values.session,
      exerciseId: values.exercise,
    });
    await context.workout.getWorkouts.invalidate();
    onClose();
  };

  const getSessionCaption = (id: string) => {
    const session = sessions?.find((session) => session.id == id);
    return session ? GetSessionCaption(session) : "";
  };

  const sessionOptions: ComboboxItem[] =
    sessions?.map((session) => {
      return {
        label: getSessionCaption(session.id),
        value: session.id,
      };
    }) ?? [];

  const exerciseOptions: ComboboxItem[] =
    exercises?.map((exercise) => {
      return {
        label: exercise.name,
        value: exercise.id,
      };
    }) ?? [];

  return (
    <Modal opened={opened} onClose={onClose} title={"Start new Workout"}>
      <form
        onSubmit={form.onSubmit((values) => {
          void addWorkout(values);
        })}
      >
        <Select
          label={"Select Gym-Session"}
          placeholder={"Session"}
          data={sessionOptions}
          withAsterisk
          {...form.getInputProps("session")}
        />
        <Select
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
