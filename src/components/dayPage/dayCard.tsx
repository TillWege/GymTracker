import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { type GymDay } from ".prisma/client";
import { GetGymDayCaption } from "~/common/gymDay";

export function DayCard(props: GymDay) {
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
      <Group mb="xs">
        <Text fw={500}>{GetGymDayCaption(props)}</Text>
        <Badge
          color="pink"
          variant="light"
          style={{ marginLeft: "Auto", marginRight: 0 }}
        >
          Chest - Day {/* TODO */}
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
      </Group>
    </Card>
  );
}
