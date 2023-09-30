import { useDisclosure } from "@mantine/hooks";
import { api, type RouterOutputs } from "~/utils/api";
import { Badge, Box, Button, Card, Flex, Group, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import {
  GetExerciseTypeColor,
  GetExerciseTypeDisplayString,
} from "~/common/exerciseType";
import {
  GetMuscleCategoryColor,
  GetMuscleCategoryDisplayString,
} from "~/common/muscleCategory";
import {
  GetMuscleGroupColor,
  GetMuscleGroupDisplayString,
} from "~/common/muscleGroup";
import { ConfigureExerciseModal } from "~/components/exercisePage/configureExerciseModal";
import { UseIsMobile } from "~/common/hooks";
import { IconPencil, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";

type ExerciseRecord = RouterOutputs["exercise"]["getExercises"][number];

export function ExerciseCard(props: ExerciseRecord) {
  const isMobile = UseIsMobile();
  const [opened, { open, close }] = useDisclosure(false);
  const context = api.useContext();

  const totalCount = (
    <Box style={{ marginLeft: "auto", marginRight: 0 }} c="dimmed">
      Total Workouts: {props._count.workouts}
    </Box>
  );
  const deleteMut = api.exercise.deleteExercise.useMutation();
  const startMut = api.workout.addWorkout.useMutation();
  const session = useSession();
  const router = useRouter();

  const deleteFunc = async () => {
    await deleteMut.mutateAsync(props.id);
    await context.exercise.getExercises.invalidate();
  };

  const startWorkout = async () => {
    await startMut.mutateAsync({
      exerciseId: props.id,
    });
    await context.workout.getWorkouts.invalidate();
    await router.push("/workout");
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
      <Flex direction={"column"} h={"100%"} justify={"space-between"}>
        <Group justify={"space-between"} align={"start"}>
          <Flex direction={"column"}>
            <Text>
              {isMobile || "Exercise Name:"} {props.name}
            </Text>
            <Box>
              {isMobile || "Exercise Type:"}{" "}
              <Badge bg={GetExerciseTypeColor(props.exerciseType)}>
                {GetExerciseTypeDisplayString(props.exerciseType)}
              </Badge>
            </Box>
          </Flex>
          <Flex direction={"column"}>
            <Box style={{ marginLeft: "auto", marginRight: 0 }}>
              {isMobile || "Category:"}
              <Badge bg={GetMuscleCategoryColor(props.muscleCategory)}>
                {GetMuscleCategoryDisplayString(props.muscleCategory)}
              </Badge>
            </Box>
            <Box style={{ marginLeft: "auto", marginRight: 0 }}>
              {isMobile || "Muscle Group:"}
              <Badge
                bg={
                  props.muscleGroup
                    ? GetMuscleGroupColor(props.muscleGroup)
                    : "gray"
                }
              >
                {props.muscleGroup
                  ? GetMuscleGroupDisplayString(props.muscleGroup)
                  : "unknown"}
              </Badge>
            </Box>
            {isMobile && totalCount}
          </Flex>
        </Group>

        <Flex justify={"space-between"} align={"end"}>
          <Group>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              leftSection={<IconPlayerPlay />}
              onClick={() => {
                void startWorkout();
              }}
            >
              Start
            </Button>

            {session?.data?.user.id == props.creatorId && (
              <>
                <Button
                  variant="light"
                  color="blue"
                  mt="md"
                  radius="md"
                  onClick={open}
                  leftSection={<IconPencil />}
                >
                  Edit
                </Button>
                <Button
                  variant="light"
                  color="red"
                  mt="md"
                  radius="md"
                  onClick={() => void deleteFunc()}
                  leftSection={<IconTrash />}
                >
                  {isMobile ? "Delete" : "Delete Exercise"}
                </Button>
              </>
            )}
          </Group>
          {isMobile || totalCount}
        </Flex>
      </Flex>
      <ConfigureExerciseModal
        existingExercise={props}
        onClose={close}
        opened={opened}
      />
    </Card>
  );
}
