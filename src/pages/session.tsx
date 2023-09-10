import { Button, Group, Modal, Text } from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";

export default function Session() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = api.session.getSessions.useQuery();

  return (
    <PageWithFab onFabClick={open} fabLabel={"Start Session"}>
      <AddSessionModal opened={opened} close={close} />
      <Text>Session</Text>
      {data?.map((session) => {
        return <Text key={session.id}>{session.id}</Text>;
      })}
    </PageWithFab>
  );
}

interface SessionModalProps {
  opened: boolean;
  close: () => void;
}

function AddSessionModal({ close, opened }: SessionModalProps) {
  const mut = api.session.startSession.useMutation();
  const context = api.useContext();

  const startWorkout = async () => {
    await mut.mutateAsync();
    await context.session.getSessions.invalidate();
    close();
  };

  return (
    <Modal opened={opened} onClose={close} withCloseButton={false}>
      <Text align={"center"} mb={"md"}>
        Are you sure you want to start a Workout?
      </Text>
      <Group position="center">
        <Button onClick={close} type={"reset"} color={"red"}>
          Cancel
        </Button>
        <Button onClick={() => void startWorkout()}>Start Session</Button>
      </Group>
    </Modal>
  );
}
