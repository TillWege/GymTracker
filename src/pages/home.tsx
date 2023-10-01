import { PageWithFab } from "~/components/pageWithFab";
import { api } from "~/utils/api";
import { DayCard } from "~/components/dayPage/dayCard";
import { Button, Center } from "@mantine/core";

export default function Home() {
  const { data, fetchNextPage, hasNextPage } = api.day.getDays.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <PageWithFab pageTitle={"All Gym Days"}>
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
