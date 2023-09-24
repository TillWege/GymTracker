import { type WorkoutSession } from "@prisma/client";

export function GetSessionCaption(session: WorkoutSession): string {
  return `Gym Session ${session.startTimestamp.toLocaleDateString()} started at ${session.startTimestamp.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
}
