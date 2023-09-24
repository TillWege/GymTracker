import { PageWithFab } from "~/components/pageWithFab";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import { WorkoutCard } from "~/components/workoutPage/workoutCard";
import { AddWorkoutModal } from "~/components/workoutPage/addWorkoutModal";

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
        return <WorkoutCard key={workout.id} {...workout}></WorkoutCard>;
      })}
    </PageWithFab>
  );
}
