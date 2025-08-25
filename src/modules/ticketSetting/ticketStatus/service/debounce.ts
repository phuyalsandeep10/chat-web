import { useRef, useCallback } from 'react';

// ---- CUSTOM DEBOUNCE HOOK ----
export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );

  return debounced as T;
}
