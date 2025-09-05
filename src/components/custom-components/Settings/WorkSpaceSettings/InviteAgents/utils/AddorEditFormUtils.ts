import { parse, format } from 'date-fns';
import { toast } from 'sonner';

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
  try {
    const parsed = parse(time12h, 'hh:mm a', new Date());
    return format(parsed, 'HH:mm');
  } catch (error) {
    // toast('Invalid time value');
    return ''; // fallback so it doesn’t break submission
  }
};

// helper (handles overnight shifts too)
export const diffInMinutes = (start: string, end: string): number => {
  try {
    // Parse both times using 12-hour format
    const startDate = parse(start, 'hh:mm a', new Date());
    const endDate = parse(end, 'hh:mm a', new Date());

    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    // Handle overnight shifts (e.g., 10:00 PM → 06:00 AM)
    return diff >= 0 ? diff : diff + 24 * 60;
  } catch {
    return 0;
  }
};
