import { PageWithFab } from "~/components/pageWithFab";
import { Button, Center } from "@mantine/core";
import { api } from "~/utils/api";
import { DayCard } from "~/components/dayPage/dayCard";

interface UserProfileProps {
  id: string;
}

export function UserProfile({ id }: UserProfileProps) {
  const { data: user } = api.user.getUser.useQuery(id);
  const { data, fetchNextPage, hasNextPage } = api.day.getDays.useInfiniteQuery(
    { userId: id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <PageWithFab pageTitle={`Profile: ${user?.name}`}>
      {data?.pages.map((page) => {
        return page.data.map((day) => {
          return <DayCard key={day.id} {...day} />;
        });
      })}
      <Center mb={"md"}>
        <Button onClick={() => void fetchNextPage()} disabled={!hasNextPage}>
          {" "}
          Load More
        </Button>
      </Center>
    </PageWithFab>
  );
}
