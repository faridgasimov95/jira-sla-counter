import { StatusInterval } from "../services/slaService";
import {
  DayType,
  getDayType,
  SpecialDay,
  specialDays,
  WORKING_HOURS,
} from "./calendar";

/**
 * Returns a new Date with the time set to the given hour (minutes, seconds and milliseconds zeroed out).
 * @param date - Given date
 * @param hours - Hour to set (in 24h format)
 * @returns The date with the given rounded hour
 */
const setTime = (date: Date, hours: number): Date => {
  const d = new Date(date);
  d.setHours(hours, 0, 0, 0);
  return d;
};

/**
 * Returns the overlap in milliseconds between two time intervals.
 * If no overlap - returns 0
 * @param start1 - Start time of first interval
 * @param end1 - End time of first interval
 * @param start2 - Start time of second interval
 * @param end2 - End time of second interval
 * @returns The overlap in milliseconds
 */
const getOverlap = (
  start1: number,
  end1: number,
  start2: number,
  end2: number
): number => {
  const start = Math.max(start1, start2);
  const end = Math.min(end1, end2);
  return Math.max(0, end - start);
};

/**
 * Calculates the working time in milliseconds within a given time range.
 * Skips weekends, holidays, lunch breaks and non-working time.
 * Also takes shortened work days into consideration
 * @param startMs - Start time of the interval
 * @param endMs - End time of the interval
 * @returns Working time in milliseconds
 */
const getIntervalWorkingTime = (
  startMs: number,
  endMs: number,
  specialDays: SpecialDay[]
): number => {
  let intervalWorkingTime = 0;

  let current = new Date(startMs);
  const end = new Date(endMs);

  while (current < end) {
    const dayStart = new Date(current);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const intervalStart = Math.max(startMs, dayStart.getTime());
    const intervalEnd = Math.min(endMs, dayEnd.getTime());

    const dayType = getDayType(dayStart, specialDays);

    if (dayType === DayType.WEEKEND || dayType === DayType.HOLIDAY) {
      current = dayEnd;
      continue;
    }

    const workStart = setTime(dayStart, WORKING_HOURS.start);
    const workEnd = setTime(
      dayStart,
      dayType === DayType.PRE_HOLIDAY
        ? WORKING_HOURS.preHolidayEnd
        : WORKING_HOURS.end
    );

    const workingTime = getOverlap(
      intervalStart,
      intervalEnd,
      workStart.getTime(),
      workEnd.getTime()
    );

    if (workingTime > 0) {
      const lunchStart = setTime(dayStart, WORKING_HOURS.lunchStart);
      const lunchEnd = setTime(dayStart, WORKING_HOURS.lunchEnd);

      const lunchTime = getOverlap(
        intervalStart,
        intervalEnd,
        lunchStart.getTime(),
        lunchEnd.getTime()
      );

      intervalWorkingTime += workingTime - lunchTime;
    }

    current = dayEnd;
  }

  return intervalWorkingTime;
};

/** Calculates the total working time in minutes across multiple intervals.
 * @param intervals The list of intervals
 * @return Total working time in minutes
 */

export const getTotalWorkingTime = (
  intervals: StatusInterval[],
  specialDays: SpecialDay[]
): number => {
  const milliseconds = intervals.reduce(
    (acc, interval) =>
      acc + getIntervalWorkingTime(interval.start, interval.end, specialDays),
    0
  );

  const minutes = milliseconds / 1000 / 60;

  return minutes;
};
