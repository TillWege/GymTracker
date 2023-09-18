import { Checkbox, Modal, NativeSelect } from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";

import { useForm } from "@mantine/form";
import { type ComboboxItem } from "@mantine/core/lib/components/Combobox/Combobox.types";

export default function Workout() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <PageWithFab
      onFabClick={open}
      fabCaption={"Start Workout"}
      pageTitle={"Workout list"}
    >
      <AddWorkoutModal opened={opened} onClose={close} />
    </PageWithFab>
  );
}

interface AddWorkoutModalProps {
  opened: boolean;
  onClose: () => void;
}

function AddWorkoutModal({ opened, onClose }: AddWorkoutModalProps) {
  const { data: latestSession } = api.session.getLatestSession.useQuery();
  const { data: sessions } = api.session.getSessionsByUser.useQuery();
  const form = useForm({
    initialValues: {
      session: latestSession?.id ?? "",
    },
    validate: {
      session: (value) => value == "",
    },
  });

  const sessionSelectionItems: ComboboxItem[] = sessions?.map((session) => ({
    label: `Gym Session ${session.startTimestamp.toLocaleDateString()} started at ${session.startTimestamp.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`,
    value: session.id,
  })) ?? [
    {
      label: "No sessions found",
      value: "",
    },
  ];

  return (
    <Modal opened={opened} onClose={onClose} title={"Start new Workout"}>
      <NativeSelect
        data={sessionSelectionItems}
        label={"Select Gym Session"}
        disabled={sessionSelectionItems.length == 0}
        {...form.getInputProps("session")}
      />
      <Checkbox mt={"md"} mb={"sm"} label={"Start new Gym Session"} />
      <NativeSelect data={[]} label={"Select Exercise"} />
    </Modal>
  );
}
