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
  Modal,
  Text,
} from "@mantine/core";
import { IconX, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { DeleteButton } from "~/components/DeleteButton";
import { AddSetButton } from "~/components/workoutPage/addSetButton";
import { type Set } from "@prisma/client";
import { GetSessionCaption } from "~/common/gymsession";
import { WorkoutRecord } from "~/pages/workout";
import { useIsMobile } from "~/common/hooks";

interface WorkoutCardProps {
  workout: WorkoutRecord;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const delWorkoutMut = api.workout.deleteWorkout.useMutation();
  const delSetMut = api.workout.deleteSet.useMutation();
  const session = useSession();
  const context = api.useContext();
  const isMobile = useIsMobile();
  const { data: prSet } = api.workout.getPRSet.useQuery({
    exerciseId: workout.exerciseId,
  });

  const deleteWorkout = async () => {
    await delWorkoutMut.mutateAsync({
      workoutId: workout.id,
    });
    await context.workout.getWorkouts.invalidate();
  };

  const containsPr = workout.sets.some((set) => set.id == prSet?.id);

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
          <Text>Workout: {workout.exercise.name}</Text>
          {containsPr && (
            <Badge style={{ marginLeft: "auto", marginRight: 0 }}>New PR</Badge>
          )}
        </Group>
        <Text>{GetSessionCaption(workout.session)}</Text>
        <Text size="sm" c="dimmed">
          Sets: {workout.sets.length}
        </Text>
        <Text size="sm" c="dimmed">
          Total Reps: {workout.sets.reduce((acc, set) => acc + set.reps, 0)}
        </Text>
        <Text size="sm" c="dimmed">
          Total Weight:{" "}
          {workout.sets.reduce((acc, set) => acc + set.reps * set.weight, 0)}
        </Text>
      </Box>
      <Collapse in={opened}>
        <List mt={"sm"} center spacing={"md"}>
          {workout.sets.map((set, idx) => {
            return (
              <SetRow
                key={idx}
                set={set}
                index={idx}
                pr={set.id == prSet?.id}
                onDelete={async () => {
                  await delSetMut.mutateAsync({
                    setId: set.id,
                  });
                  await context.workout.getWorkouts.invalidate();
                }}
              />
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
          disabled={workout.sets.length == 0}
          leftSection={opened ? <IconZoomOut /> : <IconZoomIn />}
        >
          {isMobile ? null : opened ? "Hide" : "Show"} Sets
        </Button>
        {session.data?.user?.id == workout.userId && (
          <>
            <AddSetButton workoutId={workout.id} />
            <DeleteButton
              caption={isMobile ? "Delete" : "Delete Workout"}
              onClick={deleteWorkout}
            />
          </>
        )}
      </Group>
    </Card>
  );
}

interface SetRowProps {
  set: Set;
  index: number;
  pr: boolean;
  onDelete: () => Promise<void>;
}
function SetRow({ set, onDelete, pr, index }: SetRowProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <List.Item
        key={set.id}
        icon={
          <ActionIcon
            variant={"light"}
            color={"red"}
            size={"sm"}
            onClick={open}
          >
            <IconX />
          </ActionIcon>
        }
      >
        Set {index + 1}: {set.reps} reps @ {set.weight} Kg{" "}
        {pr && <Badge>PR</Badge>}
      </List.Item>
      <Modal opened={opened} onClose={close} title={"Confirmation"}>
        <Text ta={"center"}>Are you sure you want to delete this Set?</Text>
        <Text ta={"center"} c={"red"} fw={700}>
          This action cannot be undone.
        </Text>
        <Group justify="center" mt={"md"}>
          <Button color="blue" onClick={close}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              onDelete().finally(close);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
