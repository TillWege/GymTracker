import { useDisclosure } from "@mantine/hooks";

import { useState } from "react";
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Modal,
  NumberInput,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { api } from "~/utils/api";

interface SetProps {
  reps: number;
  weight: number;
}

export function AddSetButton() {
  const [opened, { close, open }] = useDisclosure(false);
  const [showErrors, setShowErrors] = useState(false);
  const [fieldProps, setFieldProps] = useState<SetProps[]>([]);
  const addSetMut = api.workout.addSet.useMutation();

  const addSet = () => {
    setFieldProps((prev) => [
      ...prev,
      {
        reps: 0,
        weight: 0,
      },
    ]);
  };

  const onOpen = () => {
    setFieldProps([{ reps: 0, weight: 0 }]);
    setShowErrors(false);
    open();
  };

  return (
    <>
      <Button
        variant="light"
        color="green"
        mt="md"
        radius="md"
        onClick={onOpen}
      >
        Add Sets
      </Button>
      <Modal opened={opened} onClose={close} title={"Add Set"}>
        {fieldProps.map((props, index) => {
          return (
            <SetField
              value={props}
              onChange={(evenValue) => {
                setFieldProps((prev) => {
                  const copy = [...prev];
                  copy[index] = evenValue;
                  return copy;
                });
              }}
              index={index}
              onDelete={() => {
                setFieldProps((prev) => {
                  const copy = [...prev];
                  copy.splice(index, 1);
                  return copy;
                });
              }}
              showErrors={showErrors}
              key={index}
            />
          );
        })}
        <ActionIcon variant={"light"} color={"green"} onClick={addSet}>
          <IconPlus />
        </ActionIcon>
        <Group justify="center" mt={"md"}>
          <Button color="red" onClick={close}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => {
              if (
                fieldProps.some((set) => set.reps === 0 || set.weight === 0)
              ) {
                setShowErrors(true);
              } else {
                close();
              }
            }}
          >
            Add Set
          </Button>
        </Group>
      </Modal>
    </>
  );
}

interface SetFieldProps {
  value: SetProps;
  onChange: (value: SetProps) => void;
  index: number;
  onDelete: () => void;
  showErrors: boolean;
}

function SetField({
  value,
  onChange,
  index,
  onDelete,
  showErrors,
}: SetFieldProps) {
  return (
    <Fieldset
      legend={`Rep #${index + 1}`}
      mb={"md"}
      style={{ position: "relative" }}
    >
      <ActionIcon
        variant={"light"}
        color={"red"}
        size={"sm"}
        onClick={onDelete}
        style={{
          position: "absolute",
          right: "1rem",
          top: "0px",
        }}
      >
        <IconX />
      </ActionIcon>
      <NumberInput
        label={"Reps"}
        withAsterisk
        error={showErrors && value.reps === 0}
        value={value.reps}
        onChange={(val) => {
          if (typeof val !== "number") return;

          onChange({ ...value, reps: val });
        }}
        suffix={" Reps"}
      />
      <NumberInput
        label={"Weight"}
        withAsterisk
        value={value.weight}
        error={showErrors && value.weight === 0}
        onChange={(val) => {
          if (typeof val !== "number") return;

          onChange({ ...value, weight: val });
        }}
        suffix={" Kg"}
      />
    </Fieldset>
  );
}
