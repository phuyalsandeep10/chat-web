// lib/timeFormatUtils.ts
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';

export default function ShowTime(dateString?: string) {
  if (!dateString) return ''; // No time available

  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = differenceInDays(now, date);

  if (diffInDays < 1) {
    // same day → "x hours/minutes ago"
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (diffInDays < 7) {
    // within 1 week → "x days ago"
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    // older than a week → show date
    return format(date, 'MMM dd, yyyy');
  }
}
