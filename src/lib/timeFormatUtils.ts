import {
  parseISO,
  isWithinInterval,
  subDays,
  isToday,
  isYesterday,
  format,
  differenceInMinutes,
  differenceInHours,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function formatTime(
  iso: string,
  userTimeZone?: string,
  isTimeOnly: boolean = true,
): string {
  if (!iso) return '';
  const date = parseISO(iso);
  const timeZone =
    userTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(date, timeZone);
  const timeFormat = 'hh:mm a';
  if (isTimeOnly) return format(zonedDate, timeFormat);
  if (isToday(zonedDate)) {
    // Show relative time in minutes/hours like "28m", "5h"
    const diffMinutes = differenceInMinutes(new Date(), zonedDate);
    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = differenceInHours(new Date(), zonedDate);
    return `${diffHours}h`;
  } else if (isYesterday(zonedDate)) {
    return 'Yesterday';
  } else {
    // Older → show date only "24 Aug"
    return format(zonedDate, 'dd MMM');
  }
}

// New function for message grouping headers
export const getMessageDateHeader = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();

  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (isWithinInterval(date, { start: subDays(today, 7), end: today })) {
    return format(date, 'EEEE'); // e.g., "Sunday"
  }
  return format(date, 'd MMM'); // e.g., "18 Aug"
};
