import {
  Checkbox,
  Combobox,
  InputBase,
  Modal,
  NativeSelect,
  useCombobox,
  Input,
  Select,
} from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";

import { useForm } from "@mantine/form";
import { type ComboboxItem } from "@mantine/core/lib/components/Combobox/Combobox.types";
import { WorkoutSession } from ".prisma/client";
import { useState } from "react";

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
  const { data: sessions } = api.session.getSessionsByUser.useQuery();
  const form = useForm({
    initialValues: {
      session: "",
    },
    validate: {
      session: (value) => value == "",
    },
  });
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const getSessionCaption = (session: WorkoutSession) => {
    return `Gym Session ${session.startTimestamp.toLocaleDateString()} started at ${session.startTimestamp.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  const getSessionCaptionByCaptionId = (id: string) => {
    const session = sessions?.find((session) => session.id == id);
    return session ? getSessionCaption(session) : "";
  };

  const comboBoxItems =
    sessions?.map((session) => {
      return (
        <Combobox.Option key={session.id} value={session.id}>
          {getSessionCaption(session)}
        </Combobox.Option>
      );
    }) ?? [];

  return (
    <Modal opened={opened} onClose={onClose} title={"Start new Workout"}>
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          form.setFieldValue("session", val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
          >
            {form.values.session ? (
              getSessionCaptionByCaptionId(form.values.session)
            ) : (
              <Input.Placeholder>Select Gym-Session</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>{comboBoxItems}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Modal>
  );
}
