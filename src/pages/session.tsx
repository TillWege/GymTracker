import { Badge, Button, Card, Group, Modal, Text, Box } from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import { WorkoutSession } from ".prisma/client";
import { useSession } from "next-auth/react";

export default function Session() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = api.session.getSessions.useQuery();

  return (
    <PageWithFab onFabClick={open} fabLabel={"Start Session"}>
      <AddSessionModal opened={opened} close={close} />
      {data?.map((session) => {
        return <SessionCard key={session.id} {...session}></SessionCard>;
      })}
    </PageWithFab>
  );
}

function SessionCard(props: WorkoutSession) {
  const endSessionMut = api.session.endSession.useMutation();
  const userSession = useSession();

  function GetDayCaption(date: Date) {
    const dayIndex = date.getDay();

    switch (dayIndex) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "Unknown";
    }
  }

  const endSession = async () => {
    await endSessionMut.mutateAsync(props.id);
  };

  function GetDurationDisplayString(duration: number) {
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const dispHours = hours < 10 ? "0" + hours.toString() : hours.toString();
    const dispMinutes =
      minutes < 10 ? "0" + minutes.toString() : minutes.toString();

    if (hours === 0) return `${dispMinutes} minutes`;
    return dispHours + ":" + dispMinutes;
  }

  return (
    <Card
      key={props.id}
      shadow="sm"
      radius="md"
      withBorder
      mb={"md"}
      h={250}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Group position="apart" mb="xs">
        <Text weight={500}>
          Session: {GetDayCaption(props.startTimestamp)},{" "}
          {props.startTimestamp.toLocaleDateString()} started at{" "}
          {props.startTimestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {props.endTimestamp &&
            `, lasted for ${GetDurationDisplayString(
              props.endTimestamp.getTime() - props.startTimestamp.getTime()
            )}`}
        </Text>
        <Badge color="pink" variant="light">
          Leg/Arm/Chest - Day {/* TODO */}
        </Badge>
      </Group>

      <Box style={{ flex: "auto" }}>
        <Text size="sm" color="dimmed">
          More Information
        </Text>

        <Group position="apart" mt="xs">
          <Text size="sm" color="dimmed">
            Exercises: {0 /* TODO */}
          </Text>
          <Text size="sm" color="dimmed">
            Calories Burned: {0 /* TODO */}
          </Text>
        </Group>
      </Box>

      <Group>
        <Button variant="light" color="blue" mt="md" radius="md">
          Details
        </Button>
        {props.userId == userSession?.data?.user.id &&
          props.endTimestamp == undefined && (
            <Button
              variant="light"
              color="red"
              mt="md"
              radius="md"
              onClick={() => void endSession()}
            >
              End Session
            </Button>
          )}
      </Group>
    </Card>
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
