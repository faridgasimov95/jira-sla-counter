/** Represents the type of a calendar day for SLA calculation purposes. */
export enum DayType {
  WORKING = "WORKING",
  HOLIDAY = "HOLIDAY",
  PRE_HOLIDAY = "PRE_HOLIDAY",
  WEEKEND = "WEEKEND",
}

/** Represents the type of a special (non-working or shortened) day with its date and type. */
export type SpecialDay = {
  date: string;
  type: DayType.HOLIDAY | DayType.PRE_HOLIDAY;
};

/** List of public holiday and pre-holiday days in 2026 for Azerbaijan */
export const specialDays: SpecialDay[] = [
  { date: "2026-01-01", type: DayType.HOLIDAY },
  { date: "2026-01-02", type: DayType.HOLIDAY },
  { date: "2026-01-19", type: DayType.PRE_HOLIDAY },
  { date: "2026-01-20", type: DayType.HOLIDAY },
  { date: "2026-03-09", type: DayType.HOLIDAY },
  { date: "2026-03-19", type: DayType.PRE_HOLIDAY },
  { date: "2026-03-20", type: DayType.HOLIDAY },
  { date: "2026-03-23", type: DayType.HOLIDAY },
  { date: "2026-03-24", type: DayType.HOLIDAY },
  { date: "2026-03-25", type: DayType.HOLIDAY },
  { date: "2026-03-26", type: DayType.HOLIDAY },
  { date: "2026-03-27", type: DayType.HOLIDAY },
  { date: "2026-03-30", type: DayType.HOLIDAY },
  { date: "2026-05-08", type: DayType.PRE_HOLIDAY },
  { date: "2026-05-11", type: DayType.HOLIDAY },
  { date: "2026-05-26", type: DayType.PRE_HOLIDAY },
  { date: "2026-05-27", type: DayType.HOLIDAY },
  { date: "2026-05-28", type: DayType.HOLIDAY },
  { date: "2026-05-29", type: DayType.HOLIDAY },
  { date: "2026-06-15", type: DayType.HOLIDAY },
  { date: "2026-06-25", type: DayType.PRE_HOLIDAY },
  { date: "2026-06-26", type: DayType.HOLIDAY },
  { date: "2026-11-09", type: DayType.HOLIDAY },
  { date: "2026-11-10", type: DayType.HOLIDAY },
  { date: "2026-12-30", type: DayType.PRE_HOLIDAY },
  { date: "2026-12-31", type: DayType.HOLIDAY },
];

/** Working hours (in 24h format). Lunch break is excluded from SLA time. */
export const WORKING_HOURS = {
  start: 9,
  end: 18,
  lunchStart: 13,
  lunchEnd: 14,
  preHolidayEnd: 17,
};

/**
 * Determines the type of a given day (working, weekend, holiday or pre-holiday).
 * @param date - The date to evaluate
 * @returns The DayType of the given date
 */
export const getDayType = (date: Date, specialDays: SpecialDay[]): DayType => {
  const dateString = date.toLocaleDateString("en-CA");

  const isSpecial = specialDays.find((day) => day.date === dateString);

  if (isSpecial) {
    return isSpecial.type;
  }

  const day = date.getDay();

  if (day === 0 || day === 6) return DayType.WEEKEND;

  return DayType.WORKING;
};
