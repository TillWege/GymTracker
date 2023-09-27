import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface DeleteButtonProps {
  caption: string;
  onClick: () => void;
}

export function DeleteButton({ caption, onClick }: DeleteButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant="light" color="red" mt="md" radius="md" onClick={open}>
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
          <Button color="red" onClick={onClick}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
