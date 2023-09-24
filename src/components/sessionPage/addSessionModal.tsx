import { api } from "~/utils/api";
import { Button, Group, Modal, Text } from "@mantine/core";

interface SessionModalProps {
  opened: boolean;
  close: () => void;
}

export function AddSessionModal({ close, opened }: SessionModalProps) {
  const mut = api.session.startSession.useMutation();
  const context = api.useContext();

  const startWorkout = async () => {
    await mut.mutateAsync();
    await context.session.getSessions.invalidate();
    close();
  };

  return (
    <Modal opened={opened} onClose={close} withCloseButton={false}>
      <Text ta={"center"} mb={"md"}>
        Are you sure you want to start a Workout?
      </Text>
      <Group justify="center">
        <Button onClick={close} type={"reset"} color={"red"}>
          Cancel
        </Button>
        <Button onClick={() => void startWorkout()}>Start Session</Button>
      </Group>
    </Modal>
  );
}
