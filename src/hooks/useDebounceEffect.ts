import { useEffect, useRef } from 'react';

export default function useDebouncedEffect(
  effect: () => void,
  deps: React.DependencyList,
  delay: number,
) {
  const firstRun = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // cancel any pending debounce
    }

    timeoutRef.current = setTimeout(() => {
      if (firstRun.current) {
        firstRun.current = false; // skip very first run
        return;
      }
      effect();
    }, delay);

    // cleanup cancels pending timers (StrictMode will call this once per fake unmount)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
