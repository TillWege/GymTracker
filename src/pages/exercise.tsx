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
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  type ExerciseType,
  type MuscleCategory,
  type MuscleGroup,
} from "@prisma/client";
import {
  GetExerciseTypeColor,
  GetExerciseTypeDisplayString,
  GetExerciseTypeSelection,
  GetExerciseTypeValues,
  IsExerciseType,
} from "~/common/exerciseType";
import {
  GetMuscleCategoryColor,
  GetMuscleCategoryDisplayString,
  GetMuscleCategorySelection,
  GetMuscleCategoryValues,
  IsMuscleCategory,
} from "~/common/muscleCategory";
import {
  GetMuscleGroupColor,
  GetMuscleGroupDisplayString,
  GetMuscleGroupSelection,
  GetMuscleGroupValues,
  IsMuscleGroup,
} from "~/common/muscleGroup";
import { api, type RouterOutputs } from "~/utils/api";
import { type Exercise } from ".prisma/client";
import { useState } from "react";
import { useSession } from "next-auth/react";

type ExerciseRecord = RouterOutputs["exercise"]["getExercises"][number];

export default function Exercise() {
  const [opened, { open, close }] = useDisclosure(false);
  const [exerciseTypeFilters, setExerciseTypeFilters] = useState<
    ExerciseType[]
  >([]);
  const [muscleCategoryFilters, setMuscleCategoryFilters] = useState<
    MuscleCategory[]
  >([]);
  const [muscleGroupFilters, setMuscleGroupFilters] = useState<MuscleGroup[]>(
    []
  );
  const { data } = api.exercise.getExercises.useQuery({
    exerciseTypeFilter: exerciseTypeFilters,
    muscleCategoryFilter: muscleCategoryFilters,
    muscleGroupFilter: muscleGroupFilters,
  });

  return (
    <PageWithFab
      onFabClick={open}
      fabCaption={"Add Exercise"}
      pageTitle={"Exercise List"}
      titleChildren={
        <ExerciseFilterButton
          exerciseTypeFilters={exerciseTypeFilters}
          muscleCategoryFilters={muscleCategoryFilters}
          muscleGroupFilters={muscleGroupFilters}
          setExerciseTypeFilters={setExerciseTypeFilters}
          setMuscleCategoryFilters={setMuscleCategoryFilters}
          setMuscleGroupFilters={setMuscleGroupFilters}
        />
      }
    >
      {data?.map((exercise) => (
        <ExerciseCard key={exercise.id} {...exercise}></ExerciseCard>
      ))}
      <ConfigureExerciseModal
        opened={opened}
        onClose={close}
      ></ConfigureExerciseModal>
    </PageWithFab>
  );
}

function ExerciseCard(props: ExerciseRecord) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure(false);
  const context = api.useContext();

  const totalCount = (
    <Box style={{ marginLeft: "auto", marginRight: 0 }}>
      Total Workouts: {props._count.workouts}
    </Box>
  );
  const deleteMut = api.exercise.deleteExercise.useMutation();
  const session = useSession();

  const deleteFunc = async () => {
    await deleteMut.mutateAsync(props.id);
    await context.exercise.getExercises.invalidate();
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
            <Text>
              {isMobile || "Exercise Type:"}{" "}
              <Badge bg={GetExerciseTypeColor(props.exerciseType)}>
                {GetExerciseTypeDisplayString(props.exerciseType)}
              </Badge>
            </Text>
          </Flex>
          <Flex direction={"column"}>
            <Text style={{ marginLeft: "auto", marginRight: 0 }}>
              {isMobile || "Category:"}
              <Badge bg={GetMuscleCategoryColor(props.muscleCategory)}>
                {GetMuscleCategoryDisplayString(props.muscleCategory)}
              </Badge>
            </Text>
            <Text style={{ marginLeft: "auto", marginRight: 0 }}>
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
            </Text>
            {isMobile && totalCount}
          </Flex>
        </Group>

        <Flex justify={"space-between"} align={"end"}>
          <Group>
            <Button variant="light" color="green" mt="md" radius="md">
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
                >
                  Edit
                </Button>
                <Button
                  variant="light"
                  color="red"
                  mt="md"
                  radius="md"
                  onClick={() => void deleteFunc()}
                >
                  Delete Exercise
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

interface ConfigureExerciseModalProps {
  opened: boolean;
  onClose: () => void;
  existingExercise?: Exercise;
}

interface ConfigureExerciseModalFormValues {
  name: string;
  muscleCategory: MuscleCategory | "";
  muscleGroup: MuscleGroup | "";
  exerciseType: ExerciseType | "";
}

function ConfigureExerciseModal({
  opened,
  onClose: close,
  existingExercise,
}: ConfigureExerciseModalProps) {
  const form = useForm<ConfigureExerciseModalFormValues>({
    initialValues: {
      name: existingExercise?.name ?? "",
      exerciseType: existingExercise?.exerciseType ?? "",
      muscleGroup: existingExercise?.muscleGroup ?? "",
      muscleCategory: existingExercise?.muscleCategory ?? "",
    },
    validate: {
      name: (value) => value.trim().length == 0,
      exerciseType: (value) => value == "",
      muscleCategory: (value) => value == "",
    },
  });
  const addMutation = api.exercise.addExercise.useMutation();
  const updateMutation = api.exercise.updateExercise.useMutation();
  const context = api.useContext();

  const submitHandler = async (values: ConfigureExerciseModalFormValues) => {
    if (existingExercise) {
      await updateExercise(values);
    } else {
      await createExercise(values);
    }
    await context.exercise.getExercises.invalidate();
    close();
  };

  const createExercise = async (values: ConfigureExerciseModalFormValues) => {
    if (
      IsExerciseType(values.exerciseType) &&
      IsMuscleCategory(values.muscleCategory)
    ) {
      await addMutation.mutateAsync({
        name: values.name,
        muscleCategory: values.muscleCategory,
        muscleGroup: IsMuscleGroup(values.muscleGroup)
          ? values.muscleGroup
          : undefined,
        exerciseType: values.exerciseType,
      });
    }
  };

  const updateExercise = async (values: ConfigureExerciseModalFormValues) => {
    if (
      IsExerciseType(values.exerciseType) &&
      IsMuscleCategory(values.muscleCategory)
    ) {
      await updateMutation.mutateAsync({
        id: existingExercise?.id ?? "",
        name: values.name,
        muscleCategory: values.muscleCategory,
        muscleGroup: IsMuscleGroup(values.muscleGroup)
          ? values.muscleGroup
          : undefined,
        exerciseType: values.exerciseType,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${existingExercise ? "Update" : "Create new"} Exercise`}
    >
      <form onSubmit={form.onSubmit((values) => void submitHandler(values))}>
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
        <Group justify="center" mt={"md"}>
          <Button onClick={close} type={"reset"} color={"red"}>
            Cancel
          </Button>
          <Button type={"submit"}>
            {existingExercise ? "Update" : "Add"} Exercise
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

interface ExerciseFilterButtonProps {
  exerciseTypeFilters: ExerciseType[];
  muscleCategoryFilters: MuscleCategory[];
  muscleGroupFilters: MuscleGroup[];
  setExerciseTypeFilters: (filters: ExerciseType[]) => void;
  setMuscleCategoryFilters: (filters: MuscleCategory[]) => void;
  setMuscleGroupFilters: (filters: MuscleGroup[]) => void;
}

function ExerciseFilterButton({
  exerciseTypeFilters,
  muscleCategoryFilters,
  muscleGroupFilters,
  setExerciseTypeFilters,
  setMuscleCategoryFilters,
  setMuscleGroupFilters,
}: ExerciseFilterButtonProps) {
  const [filterOpen, { toggle, close: closeFilter }] = useDisclosure(false);

  const [tempExerciseTypeFilters, setTempExerciseTypeFilters] = useState<
    ExerciseType[]
  >([]);
  const [tempMuscleCategoryFilters, setTempMuscleCategoryFilters] = useState<
    MuscleCategory[]
  >([]);
  const [tempMuscleGroupFilters, setTempMuscleGroupFilters] = useState<
    MuscleGroup[]
  >([]);

  const showFilters = () => {
    setTempExerciseTypeFilters(exerciseTypeFilters);
    setTempMuscleCategoryFilters(muscleCategoryFilters);
    setTempMuscleGroupFilters(muscleGroupFilters);
    toggle();
  };

  const resetFilters = () => {
    setTempExerciseTypeFilters([]);
    setTempMuscleCategoryFilters([]);
    setTempMuscleGroupFilters([]);
  };

  const applyFilters = () => {
    setExerciseTypeFilters(tempExerciseTypeFilters);
    setMuscleCategoryFilters(tempMuscleCategoryFilters);
    setMuscleGroupFilters(tempMuscleGroupFilters);
    closeFilter();
  };

  return (
    <>
      <Button onClick={showFilters}>Configure Filters</Button>
      <Modal
        opened={filterOpen}
        onClose={() => {}}
        title={"Configure Filters"}
        withCloseButton={false}
      >
        <Text>Exercise Type</Text>
        {GetExerciseTypeValues().map((type, index) => (
          <Badge
            key={`type-${index}`}
            style={{ cursor: "pointer", userSelect: "none" }}
            color={
              tempExerciseTypeFilters.includes(type)
                ? GetExerciseTypeColor(type)
                : "gray"
            }
            onClick={() => {
              if (tempExerciseTypeFilters.includes(type)) {
                setTempExerciseTypeFilters(
                  tempExerciseTypeFilters.filter((x) => x != type)
                );
              } else {
                setTempExerciseTypeFilters([...tempExerciseTypeFilters, type]);
              }
            }}
          >
            {GetExerciseTypeDisplayString(type)}
          </Badge>
        ))}
        <Divider mt={"sm"} mb={"sm"} />
        <Text>Muscle Category</Text>
        {GetMuscleCategoryValues().map((category, index) => (
          <Badge
            key={`category-${index}`}
            style={{ cursor: "pointer", userSelect: "none" }}
            color={
              tempMuscleCategoryFilters.includes(category)
                ? GetMuscleCategoryColor(category)
                : "gray"
            }
            onClick={() => {
              if (tempMuscleCategoryFilters.includes(category)) {
                setTempMuscleCategoryFilters(
                  tempMuscleCategoryFilters.filter((x) => x != category)
                );
              } else {
                setTempMuscleCategoryFilters([
                  ...tempMuscleCategoryFilters,
                  category,
                ]);
              }
            }}
          >
            {GetMuscleCategoryDisplayString(category)}
          </Badge>
        ))}
        <Divider mt={"sm"} mb={"sm"} />
        <Text>Muscle Group</Text>
        {GetMuscleGroupValues().map((group, index) => (
          <Badge
            style={{ cursor: "pointer", userSelect: "none" }}
            key={`group-${index}`}
            color={
              tempMuscleGroupFilters.includes(group)
                ? GetMuscleGroupColor(group)
                : "gray"
            }
            onClick={() => {
              if (tempMuscleGroupFilters.includes(group)) {
                setTempMuscleGroupFilters(
                  tempMuscleGroupFilters.filter((x) => x != group)
                );
              } else {
                setTempMuscleGroupFilters([...tempMuscleGroupFilters, group]);
              }
            }}
          >
            {GetMuscleGroupDisplayString(group)}
          </Badge>
        ))}
        <Divider mt={"sm"} mb={"sm"} />
        <Group justify={"center"}>
          <Button onClick={resetFilters} type={"reset"} color={"red"}>
            Clear Filters
          </Button>
          <Button type={"submit"} onClick={applyFilters}>
            Apply Filters
          </Button>
        </Group>
      </Modal>
    </>
  );
}
