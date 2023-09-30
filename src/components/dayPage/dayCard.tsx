import { Badge, Box, Button, Card, Collapse, Group, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import { GetGymDayCaption } from "~/common/gymDay";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import {
  GetMuscleCategoryColor,
  GetMuscleCategoryValues,
} from "~/common/muscleCategory";
import { type MuscleCategory } from "@prisma/client";
import { useDisclosure } from "@mantine/hooks";
import { DeleteButton } from "~/components/DeleteButton";

type DayCardRecord = RouterOutputs["day"]["getDays"][number];

export function DayCard(props: DayCardRecord) {
  const session = useSession();
  const [opened, { toggle }] = useDisclosure(false);
  const deleteMut = api.day.deleteDay.useMutation();
  const context = api.useContext();

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
    return [...countMap.entries()].find(([_, value]) => value === max)?.[0];
  };

  const deleteFunc = async () => {
    await deleteMut.mutateAsync(props.id);
    await context.day.getDays.invalidate();
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
      <AdditionalDayCardInfo data={props} opened={opened} />

      <Group>
        <Button
          variant="light"
          color="blue"
          mt="md"
          radius="md"
          leftSection={<IconInfoCircle />}
          onClick={toggle}
        >
          {opened ? "Hide" : "Show"} Details
        </Button>
        {session?.data?.user?.id === props.user.id && (
          <DeleteButton caption={"Delete day"} onClick={deleteFunc} />
        )}
      </Group>
    </Card>
  );
}

interface DayCardInfoProps {
  data: DayCardRecord;
  opened: boolean;
}
export function AdditionalDayCardInfo({ data, opened }: DayCardInfoProps) {
  return (
    <Collapse in={opened}>
      {data.workout.map((workout) => {
        return (
          <Box
            mt={"sm"}
            key={workout.id}
            style={(theme) => ({
              borderTop: `1px solid ${theme.colors.gray[7]}`,
            })}
          >
            <Text>{workout.exercise.name}</Text>
            {workout.sets.map((set, idx) => {
              return (
                <Text key={set.id} size="sm" c="dimmed">
                  Set {idx + 1}: {set.weight} Kg x {set.reps} Reps
                </Text>
              );
            })}
          </Box>
        );
      })}
    </Collapse>
  );
}
