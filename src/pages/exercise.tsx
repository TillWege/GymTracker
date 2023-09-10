import { Modal, Text } from "@mantine/core";
import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";

export default function Exercise() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <PageWithFab onFabClick={open} fabLabel={""}>
      <Modal opened={opened} onClose={close} title="Authentication">
        <Text>Modal Content</Text>
      </Modal>
      <Text>Reee</Text>
    </PageWithFab>
  );
}
