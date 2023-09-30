import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import { IconInfoCircle, IconTrash } from "@tabler/icons-react";

import { GetGymDayCaption } from "~/common/gymDay";
import { type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";

type DayCardRecord = RouterOutputs["day"]["getDays"][number];

export function DayCard(props: DayCardRecord) {
  const session = useSession();

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
      <Group>
        <Text fw={500}>{GetGymDayCaption(props)}</Text>
        <Badge
          color="pink"
          variant="light"
          style={{ marginLeft: "Auto", marginRight: 0 }}
        >
          Chest - Day {/* TODO */}
        </Badge>
      </Group>
      <Text>{props.user.name}</Text>
      <Box style={{ flex: "auto" }} mt={"md"}>
        <Text size="sm" c="dimmed">
          Total Exercises: {0 /* TODO */}
        </Text>

        <Group justify="apart">
          <Text size="sm" c="dimmed">
            Total Sets: {0 /* TODO */}
          </Text>
          <Text size="sm" c="dimmed">
            Total Reps: {0 /* TODO */}
          </Text>
        </Group>
        <Text size="sm" c="dimmed">
          Total Weight: {0 /* TODO */}
        </Text>
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
        {session?.data?.user?.id === props.user.id && (
          <Button
            variant="light"
            color="red"
            mt="md"
            radius="md"
            leftSection={<IconTrash />}
            // TODO: onClick
          >
            Delete Data
          </Button>
        )}
      </Group>
    </Card>
  );
}
