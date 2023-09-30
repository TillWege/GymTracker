import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import {
  ActionIcon,
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

import { type WorkoutRecord } from "~/pages/workout";
import { UseIsMobile } from "~/common/hooks";
import { GetGymDayCaption } from "~/common/gymDay";
import { AddRoundButton } from "~/components/workoutPage/addRoundButton";
import { type CardioData } from "@prisma/client";

interface WorkoutCardProps {
  workout: WorkoutRecord;
}

export function CardioWorkoutCard({ workout }: WorkoutCardProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const delWorkoutMut = api.workout.deleteWorkout.useMutation();
  const delRoundMut = api.workout.deleteRound.useMutation();
  const session = useSession();
  const context = api.useContext();
  const isMobile = UseIsMobile();

  const deleteWorkout = async () => {
    await delWorkoutMut.mutateAsync({
      workoutId: workout.id,
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
          <Text>Workout: {workout.exercise.name}</Text>
        </Group>
        <Text>{GetGymDayCaption(workout.day)}</Text>
        <Text size="sm" c="dimmed">
          Total Rounds: {workout.cardioData.length}
        </Text>
        <Text size="sm" c="dimmed">
          Total Time: {workout.cardioData.reduce((a, b) => a + b.time, 0)}
        </Text>
        <Text size="sm" c="dimmed">
          Highest Intensity:{" "}
          {workout.cardioData.reduce((a, b) => Math.max(a, b.intensity), 0)}
        </Text>
      </Box>
      <Collapse in={opened}>
        <List mt={"sm"} center spacing={"md"}>
          {workout.cardioData.map((round, index) => (
            <RoundRow
              key={round.id}
              round={round}
              index={index}
              onDelete={async () => {
                await delRoundMut.mutateAsync({
                  roundId: round.id,
                });
                await context.workout.getWorkouts.invalidate();
              }}
            />
          ))}
        </List>
      </Collapse>
      <Group>
        <Button
          variant="light"
          color="blue"
          mt="md"
          radius="md"
          onClick={toggle}
          disabled={workout.cardioData.length == 0}
          leftSection={opened ? <IconZoomOut /> : <IconZoomIn />}
        >
          {isMobile ? null : opened ? "Hide" : "Show"} Rounds
        </Button>
        {session.data?.user?.id == workout.userId && (
          <>
            <AddRoundButton workoutId={workout.id} />
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

interface RoundRowProps {
  round: CardioData;
  index: number;
  onDelete: () => Promise<void>;
}

export function RoundRow({ round, index, onDelete }: RoundRowProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <List.Item
        key={round.id}
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
        Round {index + 1}: {round.distance} Km in {round.time} minutes @
        intensity {round.intensity}
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
