import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Modal,
  NativeSelect,
  Text,
  TextInput,
} from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { ExerciseType, MuscleCategory, type MuscleGroup } from "@prisma/client";
import {
  GetExerciseTypeDisplayString,
  GetExerciseTypeSelection,
  IsExerciseType,
} from "~/common/exerciseType";
import {
  GetMuscleCategoryDisplayString,
  GetMuscleCategorySelection,
  IsMuscleCategory,
} from "~/common/muscleCategory";
import {
  GetMuscleGroupDisplayString,
  GetMuscleGroupSelection,
  IsMuscleGroup,
} from "~/common/muscleGroup";
import { api } from "~/utils/api";
import { Exercise } from ".prisma/client";

export default function Exercise() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = api.exercise.getExercises.useQuery();

  return (
    <PageWithFab onFabClick={open} fabLabel={"Add Exercise"}>
      {data?.map((exercise) => (
        <ExerciseCard key={exercise.id} {...exercise}></ExerciseCard>
      ))}
      <AddExerciseModal opened={opened} onClose={close}></AddExerciseModal>
    </PageWithFab>
  );
}

function ExerciseCard(props: Exercise) {
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
        <Group position={"apart"}>
          <Flex direction={"column"}>
            <Text>Exercise Name: {props.name}</Text>
            <Text style={{ marginLeft: "auto", marginRight: 0 }}>
              Exercise Type:{" "}
              <Badge>{GetExerciseTypeDisplayString(props.exerciseType)}</Badge>
            </Text>
          </Flex>
          <Flex direction={"column"}>
            <Text style={{ marginLeft: "auto", marginRight: 0 }}>
              Category:
              <Badge>
                {GetMuscleCategoryDisplayString(props.muscleCategory)}
              </Badge>
            </Text>
            {/*TODO fix this on mobile*/}
            <Text style={{ marginLeft: "auto", marginRight: 0 }}>
              Muscle Group:{" "}
              <Badge>
                {props.muscleGroup
                  ? GetMuscleGroupDisplayString(props.muscleGroup)
                  : "unknown"}
              </Badge>
            </Text>
          </Flex>
        </Group>

        <Flex justify={"space-between"} align={"end"}>
          <Group>
            <Button variant="light" color="green" mt="md" radius="md">
              Start
            </Button>
            <Button variant="light" color="blue" mt="md" radius="md">
              Edit
            </Button>
            <Button variant="light" color="red" mt="md" radius="md">
              Delete Exercise
            </Button>
          </Group>
          <Box>Total Sessions: {0 /* TODO */}</Box>
        </Flex>
      </Flex>
    </Card>
  );
}

interface AddExerciseModalProps {
  opened: boolean;
  onClose: () => void;
}

interface AddExerciseModalFormValues {
  name: string;
  muscleCategory: MuscleCategory | "";
  muscleGroup: MuscleGroup | "";
  exerciseType: ExerciseType | "";
}

function AddExerciseModal({ opened, onClose: close }: AddExerciseModalProps) {
  const form = useForm<AddExerciseModalFormValues>({
    initialValues: {
      name: "",
      exerciseType: "",
      muscleGroup: "",
      muscleCategory: "",
    },
    validate: {
      name: (value) => value.trim().length == 0,
      exerciseType: (value) => value == "",
      muscleCategory: (value) => value == "",
    },
  });
  const mut = api.exercise.addExercise.useMutation();
  const context = api.useContext();

  const createExercise = async (values: AddExerciseModalFormValues) => {
    if (
      IsExerciseType(values.exerciseType) &&
      IsMuscleCategory(values.muscleCategory)
    ) {
      await mut.mutateAsync({
        name: values.name,
        muscleCategory: values.muscleCategory,
        muscleGroup: IsMuscleGroup(values.muscleGroup)
          ? values.muscleGroup
          : undefined,
        exerciseType: values.exerciseType,
      });
      await context.exercise.getExercises.invalidate();
      close();
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Add new Exercise">
      <form onSubmit={form.onSubmit((values) => void createExercise(values))}>
        <TextInput
          label={"Exercise Name"}
          {...form.getInputProps("name")}
          withAsterisk
        />
        <NativeSelect
          data={GetMuscleCategorySelection()}
          label={"Select Muscle Category"}
          {...form.getInputProps("muscleCategory")}
          withAsterisk
        />
        <NativeSelect
          data={GetMuscleGroupSelection()}
          label={"Select Muscle Group"}
          {...form.getInputProps("muscleGroup")}
        />
        <NativeSelect
          data={GetExerciseTypeSelection()}
          label={"Select Exercise Type"}
          withAsterisk
          {...form.getInputProps("exerciseType")}
        />
        <Group position="center" mt={"md"}>
          <Button onClick={close} type={"reset"} color={"red"}>
            Cancel
          </Button>
          <Button type={"submit"}>Add Exercise</Button>
        </Group>
      </form>
    </Modal>
  );
}
