import { parse, format } from 'date-fns';

// capitalize first letter of days
export const capitalize = (s: string | string[]) => {
  if (Array.isArray(s)) {
    return s.map(
      (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
    );
  }
  if (typeof s !== 'string') return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

// conver etime format into 24 hour
export const to24Hour = (time12h: string) => {
  if (!time12h) return '';
  const parsed = parse(time12h, 'hh:mm a', new Date());
  return format(parsed, 'HH:mm');
};

// helper (handles overnight shifts too)
export const diffInMinutes = (start12: string, end12: string) => {
  if (!start12 || !end12) return 0;
  const start = parse(start12, 'hh:mm a', new Date());
  const end = parse(end12, 'hh:mm a', new Date());
  if (end < start) end.setDate(end.getDate() + 1); // cross-midnight
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}; //place in another function
