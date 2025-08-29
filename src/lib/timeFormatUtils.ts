import {
  format,
  isToday,
  isYesterday,
  isWithinInterval,
  subDays,
} from 'date-fns';

// Existing ShowTime for ConversationsList
export const ShowTime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'h:mm a'); // e.g., "10:46 PM"
};

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
