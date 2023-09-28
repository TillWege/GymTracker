import { type WorkoutSession } from ".prisma/client";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import { DeleteButton } from "~/components/DeleteButton";
import { useIsMobile } from "~/common/hooks";
import {
  IconBusStop,
  IconClockStop,
  IconDetails,
  IconInfoCircle,
  IconPlayerStop,
} from "@tabler/icons-react";

export function SessionCard(props: WorkoutSession) {
  const endSessionMut = api.session.endSession.useMutation();
  const userSession = useSession();
  const isMobile = useIsMobile();

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
      <Group justify="apart" mb="xs">
        <Text fw={500}>
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
        <Text size="sm" c="dimmed">
          More Information
        </Text>

        <Group justify="apart" mt="xs">
          <Text size="sm" c="dimmed">
            Exercises: {0 /* TODO */}
          </Text>
          <Text size="sm" c="dimmed">
            Calories Burned: {0 /* TODO */}
          </Text>
        </Group>
      </Box>

      <Group>
        <Button
          variant="light"
          color="blue"
          mt="md"
          radius="md"
          leftSection={<IconInfoCircle />}
        >
          Details
        </Button>
        {props.userId == userSession?.data?.user.id &&
          props.endTimestamp == undefined && (
            <>
              <Button
                variant="light"
                color="yellow"
                mt="md"
                radius="md"
                onClick={() => void endSession()}
                leftSection={<IconClockStop />}
              >
                {isMobile ? "End" : "End Session"}
              </Button>
              <DeleteButton
                caption={isMobile ? "Delete" : "Delete Session"}
                onClick={() => {
                  // TODO
                }}
              />
            </>
          )}
      </Group>
    </Card>
  );
}
