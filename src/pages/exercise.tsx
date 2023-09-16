import {
  Button,
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
import { GetExerciseTypeSelection } from "~/common/exerciseType";
import { GetMuscleCategorySelection } from "~/common/muscleCategory";
import { GetMuscleGroupSelection } from "~/common/muscleGroup";

export default function Exercise() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <PageWithFab onFabClick={open} fabLabel={"Add Exercise"}>
      <Text>Exercise</Text>
      <AddExerciseModal opened={opened} onClose={close}></AddExerciseModal>
    </PageWithFab>
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
      muscleCategory: "",
      muscleGroup: "",
      exerciseType: "",
    },
    validate: {
      name: (value) => value.trim().length == 0,
      muscleCategory: (value) => value == "",
      exerciseType: (value) => value == "",
    },
  });

  return (
    <Modal opened={opened} onClose={close} title="Add new Exercise">
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
        <Button
          onClick={() => {
            console.log(form.validate());
          }}
        >
          Add Exercise
        </Button>
      </Group>
    </Modal>
  );
}
