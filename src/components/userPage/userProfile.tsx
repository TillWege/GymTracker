import { PageWithFab } from "~/components/pageWithFab";
import { Loader } from "@mantine/core";
import { api } from "~/utils/api";
import { DayCard } from "~/components/dayPage/dayCard";

interface UserProfileProps {
  id: string;
}

export function UserProfile({ id }: UserProfileProps) {
  const { data: user } = api.user.getUser.useQuery(id);
  const { data, isLoading } = api.day.getDaysByUser.useQuery(id);

  return (
    <PageWithFab pageTitle={`Profile: ${user?.name}`}>
      {isLoading && <Loader />}
      {data?.map((day) => (
        <DayCard key={day.id} {...day} />
      ))}
    </PageWithFab>
  );
}
