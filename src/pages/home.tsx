import { PageWithFab } from "~/components/pageWithFab";
import { api } from "~/utils/api";
import { DayCard } from "~/components/dayPage/dayCard";

export default function Home() {
  const { data } = api.day.getDays.useQuery();

  return (
    <PageWithFab pageTitle={"Overview"}>
      {data?.map((day) => {
        return <DayCard key={day.id} {...day} />;
      })}
    </PageWithFab>
  );
}
