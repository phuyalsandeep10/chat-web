// components/TimePicker.tsx
'use client';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { useTimeStore } from '@/components/store/timeStore';
import { TimeType, TimePickerProps } from './types';

export default function TimePicker({
  onClose,
  setFieldValue,
}: TimePickerProps) {
  const [time, setTime] = useState<TimeType>({
    hours: 7,
    minutes: 0,
    period: 'AM',
  });

  const setSavedTime = useTimeStore((state) => state.setSavedTime);

  const handleOk = () => {
    setSavedTime(time);
    const hours = time.hours.toString().padStart(2, '0');
    const minutes = time.minutes.toString().padStart(2, '0');
    const formatted = `${hours}:${minutes} ${time.period}`;

    setFieldValue(formatted);
    onClose();
  };

  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  // Calculate time from angle
  const calculateTimeFromAngle = (
    angle: number,
    type: 'hour' | 'minute',
  ): number => {
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;

    if (type === 'hour') {
      const hour = Math.round(normalized / 30) % 12;
      return hour === 0 ? 12 : hour;
    } else {
      return Math.round(normalized / 6) % 60;
    }
  };

  // Mouse drag handler
  const startDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    type: 'hour' | 'minute',
  ) => {
    setIsDragging(type);

    const onMouseMove = (e: MouseEvent) => {
      if (!clockRef.current) return;

      const rect = clockRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = e.clientX - centerX;
      const y = e.clientY - centerY;

      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;

      if (type === 'hour') {
        const hours = calculateTimeFromAngle(angle, 'hour');
        setTime((prev) => ({ ...prev, hours }));
      } else {
        const minutes = calculateTimeFromAngle(angle, 'minute');
        setTime((prev) => ({ ...prev, minutes }));
      }
    };

    const onMouseUp = () => {
      setIsDragging(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const togglePeriod = () => {
    setTime((prev) => ({
      ...prev,
      period: prev.period === 'AM' ? 'PM' : 'AM',
    }));
  };

  const hourAngle = (time.hours % 12) * 30 + (time.minutes / 60) * 30;
  const minuteAngle = time.minutes * 6;

  {
    /* handle number click */
  }

  const handleNumberClick = (
    e: React.MouseEvent<HTMLDivElement>,
    num: number,
  ) => {
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const target = e.currentTarget.getBoundingClientRect();
    const targetX = target.left + target.width / 2;
    const targetY = target.top + target.height / 2;

    const dx = targetX - centerX;
    const dy = targetY - centerY;

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (isDragging === 'minute') {
      const minutes = calculateTimeFromAngle(angle, 'minute');
      setTime((prev) => ({ ...prev, minutes }));
    } else {
      const hours = calculateTimeFromAngle(angle, 'hour');
      setTime((prev) => ({ ...prev, hours }));
    }
  };

  return (
    <div className="font-outfit">
      <h2 className="text-brand-primary mb-4 text-sm leading-[21px] font-semibold">
        Select Time
      </h2>

      {/* Input Display */}
      <div className="mb-6 flex space-x-2">
        <input
          type="number"
          min="1"
          max="12"
          value={time.hours.toString().padStart(2, '0')}
          onChange={(e) =>
            setTime((prev) => ({
              ...prev,
              hours: Math.max(0, Math.min(12, +e.target.value || 0)),
            }))
          }
          className="bg-brand-dark w-[95px] rounded-[2.69px] px-1 py-3 text-center text-xl leading-[30px] font-semibold text-white"
        />
        <span className="text-2xl font-bold text-gray-700">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={time.minutes.toString().padStart(2, '0')}
          onChange={(e) =>
            setTime((prev) => ({
              ...prev,
              minutes: Math.max(0, Math.min(59, +e.target.value || 0)),
            }))
          }
          className="bg-light-blue w-[95px] rounded-[2.69px] px-1 py-3 text-center text-xl leading-[30px] font-semibold text-black"
        />
        <div className="ml-2 flex flex-col rounded-[2.69px]">
          <button
            className={`rounded-[2.69px] px-3 py-1 text-xs leading-[17px] font-normal ${
              time.period === 'AM'
                ? 'bg-brand-dark text-white'
                : 'bg-light-blue text-black'
            }`}
            onClick={togglePeriod}
          >
            AM
          </button>
          <button
            className={`rounded-[2.69px] px-3 py-1 text-xs leading-[17px] font-normal ${
              time.period === 'PM'
                ? 'bg-brand-dark text-white'
                : 'bg-light-blue text-black'
            }`}
            onClick={togglePeriod}
          >
            PM
          </button>
        </div>
      </div>

      {/* Analog Clock */}
      <div>
        <div
          ref={clockRef}
          className="bg-light-blue relative h-64 w-64 rounded-full"
        >
          {/* Clock Numbers */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30 - 90;
            const x = Math.cos((angle * Math.PI) / 180) * 100; //gives the horizontal (x) position of a point on a circle.
            const y = Math.sin((angle * Math.PI) / 180) * 100; //gives the vertical (y) position of a point on a circle.

            const num = i === 0 ? 12 : i;
            return (
              <div
                key={i}
                className="absolute flex h-6 w-6 items-center justify-center font-semibold text-black"
                style={{
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 12px)`,
                }}
                onClick={(e) => handleNumberClick(e, num)}
              >
                {num}
              </div>
            );
          })}

          {/* Clock Center */}
          <div className="absolute top-1/2 left-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-700" />

          {/* Hour Hand */}
          <div
            onMouseDown={(e) => startDrag(e, 'hour')}
            className={`absolute top-1/2 left-1/2 z-10 origin-bottom rounded-full bg-purple-600 ${
              isDragging === 'hour'
                ? 'transition-none'
                : 'transition-transform duration-200'
            }`}
            style={{
              width: '4px',
              height: '60px',
              transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            }}
          >
            <span className="text-brand-primary absolute -top-1 left-1/2 -translate-x-1/2">
              <Icons.arrow_up />
            </span>
          </div>

          {/* Minute Hand */}
          <div
            onMouseDown={(e) => startDrag(e, 'minute')}
            className={`bg-brand-primary absolute top-1/2 left-1/2 origin-bottom rounded-full ${
              isDragging === 'minute'
                ? 'transition-none'
                : 'transition-transform duration-200'
            }`}
            style={{
              width: '2px',
              height: '80px',
              transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            }}
          >
            <span className="text-brand-primary absolute -top-1 left-1/2 -translate-x-1/2">
              <Icons.arrow_up />
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[10px] pt-[22px]">
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="default" size="sm" onClick={handleOk}>
          Ok
        </Button>
      </div>
    </div>
  );
}
