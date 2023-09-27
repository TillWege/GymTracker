import { useDisclosure } from "@mantine/hooks";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Group,
  List,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { DeleteButton } from "~/components/DeleteButton";

type WorkoutRecord = RouterOutputs["workout"]["getWorkouts"][number];

export function WorkoutCard(props: WorkoutRecord) {
  const [opened, { toggle }] = useDisclosure(false);
  const delWorkoutMut = api.workout.deleteWorkout.useMutation();
  const delSetMut = api.workout.deleteSet.useMutation();
  const addSetMut = api.workout.addSet.useMutation();
  const session = useSession();

  const context = api.useContext();
  const deleteSet = async (id: string) => {
    console.log(id);
  };

  const deleteWorkout = async () => {
    await delWorkoutMut.mutateAsync({
      workoutId: props.id,
    });
    await context.workout.getWorkouts.invalidate();
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
        {session.data?.user?.id == props.userId && (
          <>
            <DeleteButton caption={"Delete Workout"} onClick={() => {}} />
            <AddSetButton></AddSetButton>
          </>
        )}
      </Group>
    </Card>
  );
}

function AddSetButton() {
  return (
    <Button variant="light" color="green" mt="md" radius="md">
      Add Set
    </Button>
  );
}
