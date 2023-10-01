import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api, type RouterOutputs } from "~/utils/api";
import { AddWorkoutModal } from "~/components/workoutPage/addWorkoutModal";
import { BaseWorkoutCard } from "~/components/workoutPage/baseWorkoutCard";
import { Button, Center, Checkbox } from "@mantine/core";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export type WorkoutRecord =
  RouterOutputs["workout"]["getWorkouts"]["data"][number];

export default function Workout() {
  const [opened, { open, close }] = useDisclosure(false);
  const [onlyMine, setOnlyMine] = useState(false);
  const session = useSession();
  const router = useRouter();
  const { exerciseId } = router.query;

  const { data, fetchNextPage, hasNextPage } =
    api.workout.getWorkouts.useInfiniteQuery(
      {
        onlyMine,
        exerciseId: exerciseId ? (exerciseId as string) : undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <PageWithFab
      onFabClick={open}
      fabCaption={"Start Workout"}
      pageTitle={`Workout List${exerciseId ? " (Filtered)" : ""}`}
      titleChildren={
        <Checkbox
          label="Only show Mine"
          checked={onlyMine}
          disabled={!session.data?.user}
          onChange={(e) => setOnlyMine(e.currentTarget.checked)}
        />
      }
    >
      <AddWorkoutModal opened={opened} onClose={close} />
      {data?.pages.map((page) => {
        return page.data.map((workout) => {
          return <BaseWorkoutCard key={workout.id} workout={workout} />;
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
