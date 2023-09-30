import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import { IconInfoCircle, IconTrash } from "@tabler/icons-react";

import { GetGymDayCaption } from "~/common/gymDay";
import { type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import {
  GetMuscleCategoryColor,
  GetMuscleCategoryValues,
} from "~/common/muscleCategory";
import { MuscleCategory } from "@prisma/client";

type DayCardRecord = RouterOutputs["day"]["getDays"][number];

export function DayCard(props: DayCardRecord) {
  const session = useSession();

  const getDayType = () => {
    const countMap = new Map<string, number>();
    const data = GetMuscleCategoryValues();
    data.forEach((value) => {
      countMap.set(value, 0);
    });

    props.workout.forEach((workout) => {
      const category = workout.exercise.muscleCategory;
      const count = countMap.get(category) || 0;
      countMap.set(category, count + 1);
    });

    const max = Math.max(...countMap.values());
    const maxKey = [...countMap.entries()].find(
      ([key, value]) => value === max
    )?.[0];
    return maxKey;
  };

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
          color={GetMuscleCategoryColor(getDayType() as MuscleCategory)}
          variant="light"
          style={{ marginLeft: "Auto", marginRight: 0 }}
        >
          {getDayType()} - Day
        </Badge>
      </Group>
      <Text>{props.user.name}</Text>
      <Box style={{ flex: "auto" }} mt={"md"}>
        <Text size="sm" c="dimmed">
          Total Exercises: {props.workout.length}
        </Text>

        <Group justify="apart">
          <Text size="sm" c="dimmed">
            Total Sets:{" "}
            {props.workout.reduce((acc, cur) => acc + cur.sets.length, 0)}
          </Text>
          <Text size="sm" c="dimmed">
            Total Reps:{" "}
            {props.workout.reduce((acc, cur) => {
              return acc + cur.sets.reduce((acc, cur) => acc + cur.reps, 0);
            }, 0)}
          </Text>
        </Group>
        <Text size="sm" c="dimmed">
          Total Weight:{" "}
          {props.workout.reduce((acc, cur) => {
            return (
              acc +
              cur.sets.reduce((acc, cur) => acc + cur.weight * cur.reps, 0)
            );
          }, 0)}
          Kg
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
