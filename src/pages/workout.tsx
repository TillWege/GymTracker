import {
  Modal,
  Select,
  Group,
  Button,
  Card,
  Text,
  Box,
  Collapse,
  List,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api, RouterOutputs } from "~/utils/api";
import { useForm } from "@mantine/form";
import { type ComboboxItem } from "@mantine/core/lib/components/Combobox/Combobox.types";
import { useEffect } from "react";
import { Workout } from ".prisma/client";
import { IconX } from "@tabler/icons-react";
import { GetSessionCaption } from "~/common/gymsession";

type WorkoutRecord = RouterOutputs["workout"]["getWorkouts"][number];

export default function Workout() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = api.workout.getWorkouts.useQuery();

  return (
    <PageWithFab
      onFabClick={open}
      fabCaption={"Start Workout"}
      pageTitle={"Workout list"}
    >
      <AddWorkoutModal opened={opened} onClose={close} />
      {data?.map((workout) => {
        return <WorkoutCard key={workout.id} {...workout}></WorkoutCard>;
      })}
    </PageWithFab>
  );
}

interface AddWorkoutForm {
  session: string;
  exercise: string;
}

interface AddWorkoutModalProps {
  opened: boolean;
  onClose: () => void;
}

function AddWorkoutModal({ opened, onClose }: AddWorkoutModalProps) {
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
  const mut = api.workout.addWorkout.useMutation();
  const context = api.useContext();
  const { data: sessions } = api.session.getSessionsByUser.useQuery();
  const { data: exercises } = api.exercise.getExercises.useQuery();

  useEffect(() => {
    form.reset();
  }, [opened]);

  const addWorkout = async (values: AddWorkoutForm) => {
    await mut.mutateAsync({
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

function WorkoutCard(props: WorkoutRecord) {
  const [opened, { toggle }] = useDisclosure(false);

  const deleteSet = async (id: string) => {
    console.log(id);
  };

  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      mb={"md"}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Group>
          <Text>Workout:</Text>
          <Badge style={{ marginLeft: "auto", marginRight: 0 }}>New PR</Badge>
        </Group>
        <Text>Gym-Session</Text>
        <Text size="sm" c="dimmed">
          Sets: {props.sets.length}
        </Text>
        <Text size="sm" c="dimmed">
          Total Reps: {props.sets.reduce((acc, set) => acc + set.reps, 0)}
        </Text>
        <Text size="sm" c="dimmed">
          Total Weight:{" "}
          {props.sets.reduce((acc, set) => acc + set.reps * set.weight, 0)}
        </Text>
      </Box>
      <Collapse in={opened}>
        <List mt={"sm"} center spacing={"md"}>
          {props.sets.map((set, idx) => {
            return (
              <List.Item
                key={set.id}
                icon={
                  <ActionIcon
                    variant={"light"}
                    color={"red"}
                    size={"sm"}
                    onClick={() => void deleteSet(set.id)}
                  >
                    <IconX />
                  </ActionIcon>
                }
              >
                Set {idx}
              </List.Item>
            );
          })}
        </List>
      </Collapse>
      <Group>
        <Button
          variant="light"
          color="blue"
          mt="md"
          radius="md"
          onClick={toggle}
          disabled={props.sets.length == 0}
        >
          {opened ? "Hide" : "Show"} Set Details
        </Button>
        <Button variant="light" color="red" mt="md" radius="md">
          Delete Workout
        </Button>
        <Button variant="light" color="green" mt="md" radius="md">
          Add Set
        </Button>
      </Group>
    </Card>
  );
}
