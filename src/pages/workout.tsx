import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api, type RouterOutputs } from "~/utils/api";
import { AddWorkoutModal } from "~/components/workoutPage/addWorkoutModal";
import { BaseWorkoutCard } from "~/components/workoutPage/baseWorkoutCard";

export type WorkoutRecord = RouterOutputs["workout"]["getWorkouts"][number];

export default function Workout() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = api.workout.getWorkouts.useQuery();

  return (
    <PageWithFab
      onFabClick={open}
      fabCaption={"Start Workout"}
      pageTitle={"Workout list"}
    >
      <AddWorkoutModal opened={opened} onClose={close} />
      {data?.map((workout) => {
        return <BaseWorkoutCard key={workout.id} workout={workout} />;
      })}
    </PageWithFab>
  );
}
