import axios from "axios";
import { DayType, SpecialDay } from "../utils/calendar";
import { specialDays as azSpecialDays } from "../utils/calendar";

async function fetchHolidaysForYear(
  year: number,
  countryCode: string
): Promise<SpecialDay[]> {
  const response = await axios.get(
    `https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`
  );

  return response.data.map((h: any) => ({
    date: h.date,
    type: DayType.HOLIDAY,
  }));
}

export async function getSpecialDays(
  countryCode: string,
  years: number[]
): Promise<SpecialDay[]> {
  if (countryCode === "AZ") return azSpecialDays;

  const results = await Promise.all(
    years.map((year) => fetchHolidaysForYear(year, countryCode))
  );
  return results.flat();
}
