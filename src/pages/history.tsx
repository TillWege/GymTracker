import { PageWithFab } from "~/components/pageWithFab";
import { api } from "~/utils/api";
import { NativeSelect } from "@mantine/core";
import { useState } from "react";
import { type ComboboxItem } from "@mantine/core/lib/components/Combobox/Combobox.types";
import {
  CategoryScale,
  Chart as ChartJs,
  Legend,
  Title,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ExerciseType } from "@prisma/client";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Development of your strength",
    },
  },
};

export default function History() {
  const [exercise, setExercise] = useState("");
  const { data: exercises } = api.exercise.getExercises.useQuery();

  const { data } = api.workout.getDataForHistory.useQuery({
    exerciseId: exercise,
  });

  const exerciseOptions: ComboboxItem[] = [
    { value: "", label: "Select Exercise" },
    ...(exercises?.map((exercise) => {
      return {
        label: exercise.name,
        value: exercise.id,
      };
    }) ?? []),
  ];

  const labels =
    data?.map((workout) => {
      return new Date(workout.day.date).toLocaleDateString();
    }) ?? [];

  const uniqueLabels = [...new Set(labels)];

  const isCardio =
    data?.at(0)?.exercise.exerciseType === ExerciseType.CARDIO ?? false;

  const diagData = {
    labels,
    datasets: [
      {
        label: isCardio ? "Max Time" : "Max Weight",
        data: uniqueLabels.map((date) => {
          const workoutsOfDay = data?.filter(
            (workout) =>
              new Date(workout.day.date).toLocaleDateString() === date
          );
          if (isCardio) {
            let maxTime = 0;
            workoutsOfDay?.forEach((workout) => {
              workout.cardioData.forEach((round) => {
                if (round.time > maxTime) {
                  maxTime = round.time;
                }
              });
            });
            return maxTime;
          } else {
            let maxWeight = 0;
            workoutsOfDay?.forEach((workout) => {
              workout.sets.forEach((set) => {
                if (set.weight > maxWeight) {
                  maxWeight = set.weight;
                }
              });
            });
            return maxWeight;
          }
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <PageWithFab pageTitle={"History"}>
      <NativeSelect
        label={"Select Exercise"}
        value={exercise}
        data={exerciseOptions}
        onChange={(event) => setExercise(event.currentTarget.value)}
      />
      <Line options={options} data={diagData} />
    </PageWithFab>
  );
}
