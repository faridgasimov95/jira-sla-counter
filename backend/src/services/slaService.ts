/** A singe status entry from Jira ticket history with the timestamp.*/
export type StatusEntry = {
  status: string;
  timestamp: number;
};

/** A time interval during which a ticket had a specific status. */
export type StatusInterval = {
  status: string;
  start: number;
  end: number;
};

/**
 * Normalizes raw status entry into a format more suitable for calculations by converting Date into milliseconds.
 * @param values - Array of raw status history entries from the Jira API
 * @returns Array of normalized StatusEntry objects
 */
export const normalize = (values: any[]): StatusEntry[] => {
  return values.map((value) => {
    return {
      status: value.status,
      timestamp: value.statusDate.epochMillis,
    };
  });
};

/**
 * Converts an array of status entries into time intervals.
 * Each interval spans from one status change to the next.
 * The last interval ends at the current time.
 * @param entries - Normalized status entries in chronological order
 * @returns Array of StatusInterval objects
 */
export const buildIntervals = (entries: StatusEntry[]): StatusInterval[] => {
  return entries.map((entry, index) => {
    const next = entries[index + 1];

    return {
      status: entry.status,
      start: entry.timestamp,
      end: next ? next.timestamp : Date.now(),
    };
  });
};

/**
 * Filters intervals to only those where the ticket was in "Second line" status
 * @param intervals - All StatusInterval of a ticket
 * @returns Array of "Second Line" intervals
 */
export const getSecondLineIntervals = (
  intervals: StatusInterval[]
): StatusInterval[] => {
  return intervals.filter((interval) => interval.status === "Second line");
};
