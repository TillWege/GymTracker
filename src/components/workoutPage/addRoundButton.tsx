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
import { UseIsMobile } from "~/common/hooks";

interface RoundProps {
  time: number;
  intensity: number;
  distance: number;
}

interface AddRoundButtonProps {
  workoutId: string;
}

export function AddRoundButton({ workoutId }: AddRoundButtonProps) {
  const [opened, { close, open }] = useDisclosure(false);
  const [showErrors, setShowErrors] = useState(false);
  const [fieldProps, roundFieldProps] = useState<RoundProps[]>([]);
  const addRoundMut = api.workout.addRound.useMutation();
  const context = api.useContext();
  const isMobile = UseIsMobile();

  const addRound = () => {
    roundFieldProps((prev) => [
      ...prev,
      {
        distance: 0,
        time: 0,
        intensity: 0,
      },
    ]);
  };

  const onOpen = () => {
    roundFieldProps([{ distance: 0, time: 0, intensity: 0 }]);
    setShowErrors(false);
    open();
  };

  const submit = async () => {
    await addRoundMut.mutateAsync({
      workoutId: workoutId,
      data: fieldProps.map((set) => ({
        distance: set.distance,
        time: set.time,
        intensity: set.intensity,
      })),
    });
    await context.workout.getWorkouts.invalidate();
    close();
  };

  return (
    <>
      <Button
        variant="light"
        color="green"
        mt="md"
        radius="md"
        onClick={onOpen}
        leftSection={<IconPlus />}
      >
        {isMobile ? "Add" : "Add Round"}
      </Button>
      <Modal opened={opened} onClose={close} title={"Add Round"}>
        {fieldProps.map((props, index) => {
          return (
            <RoundField
              value={props}
              onChange={(evenValue) => {
                roundFieldProps((prev) => {
                  const copy = [...prev];
                  copy[index] = evenValue;
                  return copy;
                });
              }}
              index={index}
              onDelete={() => {
                roundFieldProps((prev) => {
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
        <ActionIcon variant={"light"} color={"green"} onClick={addRound}>
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
                fieldProps.some(
                  (round) =>
                    round.intensity === 0 ||
                    round.time === 0 ||
                    round.distance === 0
                )
              ) {
                setShowErrors(true);
              } else {
                void submit();
              }
            }}
          >
            Add Round
          </Button>
        </Group>
      </Modal>
    </>
  );
}

interface RoundFieldProps {
  value: RoundProps;
  onChange: (value: RoundProps) => void;
  index: number;
  onDelete: () => void;
  showErrors: boolean;
}

function RoundField({
  value,
  onChange,
  index,
  onDelete,
  showErrors,
}: RoundFieldProps) {
  return (
    <Fieldset
      legend={`Round #${index + 1}`}
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
        label={"Distance"}
        withAsterisk
        error={showErrors && value.distance === 0}
        value={value.distance}
        onChange={(val) => {
          if (typeof val !== "number") return;

          onChange({ ...value, distance: val });
        }}
        suffix={" Km"}
      />
      <NumberInput
        label={"Time"}
        withAsterisk
        error={showErrors && value.time === 0}
        value={value.time}
        onChange={(val) => {
          if (typeof val !== "number") return;

          onChange({ ...value, time: val });
        }}
        suffix={" Minutes"}
      />
      <NumberInput
        label={"Intensity"}
        withAsterisk
        value={value.intensity}
        error={showErrors && value.intensity === 0}
        onChange={(val) => {
          if (typeof val !== "number") return;

          onChange({ ...value, intensity: val });
        }}
      />
    </Fieldset>
  );
}
