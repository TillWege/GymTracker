import {
  Button,
  Checkbox,
  Group,
  Input,
  Modal,
  NativeSelect,
  Text,
  TextInput,
} from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";

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
function AddExerciseModal({ opened, onClose: close }: AddExerciseModalProps) {
  return (
    <Modal opened={opened} onClose={close} title="Add new Exercise">
      <NativeSelect data={["test", "test2"]} label={"Select Muscle Group"} />
      <NativeSelect data={["test", "test2"]} label={"Select Exercise Type"} />
      <TextInput label={"Exercise Name"} mt={"md"} />
      <Group position="center" mt={"md"}>
        <Button onClick={close} type={"reset"} color={"red"}>
          Cancel
        </Button>
        <Button>Add Exercise</Button>
      </Group>
    </Modal>
  );
}
