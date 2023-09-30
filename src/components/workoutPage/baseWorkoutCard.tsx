import { type WorkoutRecord } from "~/pages/workout";
import { StrengthWorkoutCard } from "~/components/workoutPage/strengthWorkoutCard";
import { CardioWorkoutCard } from "~/components/workoutPage/cardioWorkoutCard";

interface WorkoutCardProps {
  workout: WorkoutRecord;
}

export function BaseWorkoutCard({ workout }: WorkoutCardProps) {
  return workout.exercise.exerciseType === "CARDIO" ? (
    <CardioWorkoutCard workout={workout} />
  ) : (
    <StrengthWorkoutCard workout={workout} />
  );
}
