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
import { api } from "~/utils/api";
import { type Exercise } from ".prisma/client";
import { useState } from "react";

export default function Exercise() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = api.exercise.getExercises.useQuery();
  const [exerciseTypeFilters, setExerciseTypeFilters] = useState<
    ExerciseType[]
  >([]);
  const [muscleCategoryFilters, setMuscleCategoryFilters] = useState<
    MuscleCategory[]
  >([]);
  const [muscleGroupFilters, setMuscleGroupFilters] = useState<MuscleGroup[]>(
    []
  );

  return (
    <PageWithFab
      onFabClick={open}
      fabLabel={"Add Exercise"}
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
      <AddExerciseModal opened={opened} onClose={close}></AddExerciseModal>
    </PageWithFab>
  );
}

function ExerciseCard(props: Exercise) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const totalCount = (
    <Box style={{ marginLeft: "auto", marginRight: 0 }}>
      Total Sessions: {0 /* TODO */}
    </Box>
  );
  const deleteMut = api.exercise.deleteExercise.useMutation();

  const deleteFunc = async () => {
    await deleteMut.mutateAsync(props.id);
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
        <Group position={"apart"} align={"start"}>
          <Flex direction={"column"}>
            <Text>
              {isMobile || "Exercise Name:"} {props.name}
            </Text>
            <Text>
              {isMobile || "Exercise Type:"}{" "}
              <Badge color={GetExerciseTypeColor(props.exerciseType)}>
                {GetExerciseTypeDisplayString(props.exerciseType)}
              </Badge>
            </Text>
          </Flex>
          <Flex direction={"column"}>
            <Text style={{ marginLeft: "auto", marginRight: 0 }}>
              {isMobile || "Category:"}
              <Badge color={GetMuscleCategoryColor(props.muscleCategory)}>
                {GetMuscleCategoryDisplayString(props.muscleCategory)}
              </Badge>
            </Text>
            <Text style={{ marginLeft: "auto", marginRight: 0 }}>
              {isMobile || "Muscle Group:"}
              <Badge
                color={
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
            <Button variant="light" color="blue" mt="md" radius="md">
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
          </Group>
          {isMobile || totalCount}
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
        <Group position={"center"}>
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
