import { type GymDay } from ".prisma/client";
export function GetGymDayCaption(day: GymDay): string {
  const date = day.date;

  return `Gym Session, ${GetDateCaption(day)} the ${date.getDate()}${
    date.getDate() === 1
      ? "st"
      : date.getDate() === 2
      ? "nd"
      : date.getDate() === 3
      ? "rd"
      : "th"
  } of ${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
}

export function GetDateCaption(gymDay: GymDay) {
  const date = gymDay.date;
  const dayIndex = date.getDay();

  switch (dayIndex) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Unknown";
  }
}

export function GetDayLimits(date: Date): [Date, Date] {
  const dayStartDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const dayEndDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  return [dayStartDate, dayEndDate];
}
