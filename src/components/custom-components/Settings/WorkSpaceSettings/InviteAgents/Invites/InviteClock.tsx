import React, { useState, useRef, useCallback } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
// interface TimePickerProps {
//   initialHour?: number;
//   initialMinute?: number;
//   initialPeriod?: 'AM' | 'PM';
// }

export function TimePicker() {
  const [time, setTime] = useState({ hours: 7, minutes: 0, period: 'AM' });
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);

  const clockRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth animations
  const hourAngle = useMotionValue(
    (time.hours % 12) * 30 + (time.minutes / 60) * 30,
  );
  const minuteAngle = useMotionValue(time.minutes * 6);

  // Convert angle to time
  const calculateTimeFromAngle = useCallback(
    (angle: number, type: 'hour' | 'minute') => {
      let normalizedAngle = angle % 360;
      if (normalizedAngle < 0) normalizedAngle += 360;

      if (type === 'hour') {
        const hourValue = Math.round(normalizedAngle / 30) % 12;
        return hourValue === 0 ? 12 : hourValue;
      } else {
        return Math.round(normalizedAngle / 6) % 60;
      }
    },
    [],
  );

  // Handle dragging clock hands
  const handleDrag = useCallback(
    (info: PanInfo, type: 'hour' | 'minute') => {
      if (!clockRef.current) return;

      const rect = clockRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = info.point.x - centerX;
      const y = info.point.y - centerY;

      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;

      if (type === 'hour') {
        hourAngle.set(angle);
        const hours = calculateTimeFromAngle(angle, 'hour');
        setTime((prev) => ({ ...prev, hours }));
      } else {
        minuteAngle.set(angle);
        const minutes = calculateTimeFromAngle(angle, 'minute');
        setTime((prev) => ({ ...prev, minutes }));
      }
    },
    [calculateTimeFromAngle, hourAngle, minuteAngle],
  );

  // Handle clicking on numbers
  const handleNumberClick = useCallback(
    (num: number) => {
      if (isDragging === 'hour') {
        const angle = num * 30;
        hourAngle.set(angle);
        setTime((prev) => ({ ...prev, hours: num === 0 ? 12 : num }));
      } else if (isDragging === 'minute') {
        const angle = num * 30;
        minuteAngle.set(angle);
        setTime((prev) => ({ ...prev, minutes: num * 5 }));
      } else {
        // Default to hour selection if no hand is being dragged
        const angle = num * 30;
        hourAngle.set(angle);
        setTime((prev) => ({ ...prev, hours: num === 0 ? 12 : num }));
      }
    },
    [isDragging, hourAngle, minuteAngle],
  );

  // Toggle AM/PM
  const togglePeriod = useCallback(() => {
    setTime((prev) => ({
      ...prev,
      period: prev.period === 'AM' ? 'PM' : 'AM',
    }));
  }, []);

  // Handle input changes
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    value = Math.max(1, Math.min(12, value));
    const angle = value * 30;
    hourAngle.set(angle);
    setTime((prev) => ({ ...prev, hours: value }));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    value = Math.max(0, Math.min(59, value));
    const angle = value * 6;
    minuteAngle.set(angle);
    setTime((prev) => ({ ...prev, minutes: value }));
  };

  // const clockRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <h2 className="mb-8 text-2xl font-semibold text-purple-600">
          Select time
        </h2>

        {/* Time Input Display */}
        <div className="mb-8 flex items-center justify-center space-x-2">
          <div className="min-w-[80px] rounded-lg bg-purple-900 px-4 py-3 text-center text-white">
            <input
              type="number"
              min="1"
              max="12"
              value={time.hours}
              onChange={handleHourChange}
              className="w-full border-none bg-transparent text-center text-2xl font-bold text-white outline-none"
            />
          </div>

          <div className="text-2xl font-bold text-gray-600">:</div>

          <div className="min-w-[80px] rounded-lg bg-purple-200 px-4 py-3 text-center text-purple-900">
            <input
              type="number"
              min="0"
              max="59"
              value={time.minutes.toString().padStart(2, '0')}
              onChange={handleMinuteChange}
              className="w-full border-none bg-transparent text-center text-2xl font-bold text-purple-900 outline-none"
            />
          </div>

          <div className="ml-4 flex flex-col">
            <button
              onClick={togglePeriod}
              className={`rounded-t-lg px-3 py-1 text-sm font-medium transition-colors${
                time.period === 'AM'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              AM
            </button>
            <button
              onClick={togglePeriod}
              className={`rounded-b-lg px-3 py-1 text-sm font-medium transition-colors ${
                time.period === 'PM'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Analog Clock */}
        <div className="mb-8 flex justify-center">
          <div
            ref={clockRef}
            className="relative h-64 w-64 cursor-pointer rounded-full bg-purple-200 select-none"
            // onClick={handleClockClick}
          >
            {/* Clock Numbers */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
              const angle = index * 30 - 90;
              const x = Math.cos((angle * Math.PI) / 180) * 100;
              const y = Math.sin((angle * Math.PI) / 180) * 100;

              return (
                <div
                  key={num}
                  className="absolute flex h-6 w-6 items-center justify-center text-lg font-semibold text-purple-900"
                  style={{
                    left: `calc(50% + ${x}px - 12px)`,
                    top: `calc(50% + ${y}px - 12px)`,
                  }}
                  onClick={() => handleNumberClick(num === 12 ? 0 : num)}
                >
                  {num}
                </div>
              );
            })}

            {/* Clock Center */}
            <div className="absolute top-1/2 left-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-600"></div>

            {/* Hour Hand */}
            <div
              className={`absolute top-1/2 left-1/2 z-10 origin-bottom cursor-grab rounded-full bg-purple-600 active:cursor-grabbing ${
                isDragging === 'hour'
                  ? 'transition-none'
                  : 'transition-transform duration-150 ease-out'
              }`}
              style={{
                width: '4px',
                height: '60px',
                transform: `translate(-50%, -100%) rotate(deg)`,
              }}
              onMouseDown={() => setIsDragging('hour')}
            >
              {/* Hour Hand Tip */}
              <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full bg-purple-600"></div>
            </div>

            {/* Minute Hand */}
            <div
              className={`absolute top-1/2 left-1/2 z-10 origin-bottom cursor-grab rounded-full bg-purple-600 active:cursor-grabbing ${
                isDragging === 'minute'
                  ? 'transition-none'
                  : 'transition-transform duration-150 ease-out'
              }`}
              style={{
                width: '3px',
                height: '80px',
                transform: `translate(-50%, -100%) rotate(deg)`,
              }}
              onMouseDown={() => setIsDragging('minute')}
            >
              {/* Minute Hand Tip */}
              <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full bg-purple-600"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button className="flex-1 rounded-lg border border-purple-300 px-6 py-3 font-medium text-purple-600 transition-colors hover:bg-purple-50">
            Cancel
          </button>
          <button className="flex-1 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
