import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

interface DeleteButtonProps {
  caption: string;
  onClick: () => Promise<void>;
}

export function DeleteButton({ caption, onClick }: DeleteButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        variant="light"
        color="red"
        mt="md"
        radius="md"
        onClick={open}
        leftSection={<IconTrash />}
      >
        {caption}
      </Button>
      <Modal opened={opened} onClose={close} title={caption}>
        <Text>
          Are you sure you want to delete this? This action cannot be undone.
        </Text>
        <Group justify="center">
          <Button color="blue" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={() => void onClick()}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
