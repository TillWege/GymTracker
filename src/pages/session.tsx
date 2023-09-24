import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import { SessionCard } from "~/components/sessionPage/sessionCard";
import { AddSessionModal } from "~/components/sessionPage/addSessionModal";

export default function Session() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = api.session.getSessions.useQuery();

  return (
    <PageWithFab
      onFabClick={open}
      fabCaption={"Start Session"}
      pageTitle={"Session List"}
    >
      <AddSessionModal opened={opened} close={close} />
      {data?.map((session) => {
        return <SessionCard key={session.id} {...session}></SessionCard>;
      })}
    </PageWithFab>
  );
}
