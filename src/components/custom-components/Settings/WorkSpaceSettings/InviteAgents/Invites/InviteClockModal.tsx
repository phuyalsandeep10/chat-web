// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';

// interface InviteClockModalProps {
//   onTimeChange?: (time: {
//     hours: number;
//     minutes: number;
//     isAM: boolean;
//   }) => void;
//   onCancel?: () => void;
//   onOK?: () => void;
//   initialTime?: { hours: number; minutes: number; isAM: boolean };
// }

// export const InviteClockModal: React.FC<InviteClockModalProps> = ({
//   onTimeChange,
//   onCancel,
//   onOK,
//   initialTime = { hours: 7, minutes: 0, isAM: true },
// }) => {
//   const [hours, setHours] = useState(initialTime.hours);
//   const [minutes, setMinutes] = useState(initialTime.minutes);
//   const [isAM, setIsAM] = useState(initialTime.isAM);
//   const [isDraggingHour, setIsDraggingHour] = useState(false);
//   const [isDraggingMinute, setIsDraggingMinute] = useState(false);
//   const clockRef = useRef<SVGSVGElement>(null);

//   // Convert 12-hour format to display format
//   const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

//   // Get angle for hour hand (30 degrees per hour)
//   const hourAngle = (displayHours % 12) * 30 + (minutes / 60) * 30;

//   // Get angle for minute hand (6 degrees per minute)
//   const minuteAngle = minutes * 6;

//   // Convert angle to coordinates for clock hands
//   const getHandCoordinates = (angle: number, length: number) => {
//     const radian = (angle - 90) * (Math.PI / 180);
//     return {
//       x: 120 + length * Math.cos(radian),
//       y: 120 + length * Math.sin(radian),
//     };
//   };

//   const hourHand = getHandCoordinates(hourAngle, 60);
//   const minuteHand = getHandCoordinates(minuteAngle, 80);

//   // Get angle from mouse position
//   const getAngleFromPosition = useCallback(
//     (clientX: number, clientY: number) => {
//       if (!clockRef.current) return 0;

//       const rect = clockRef.current.getBoundingClientRect();
//       const centerX = rect.left + rect.width / 2;
//       const centerY = rect.top + rect.height / 2;

//       const deltaX = clientX - centerX;
//       const deltaY = clientY - centerY;

//       let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
//       if (angle < 0) angle += 360;

//       return angle;
//     },
//     [],
//   );

//   // Handle hour hand drag
//   const handleHourDrag = useCallback(
//     (clientX: number, clientY: number) => {
//       const angle = getAngleFromPosition(clientX, clientY);
//       const newHour = Math.round(angle / 30) % 12;
//       const adjustedHour =
//         newHour === 0 ? (isAM ? 12 : 0) : isAM ? newHour : newHour + 12;
//       setHours(adjustedHour);
//     },
//     [getAngleFromPosition, isAM],
//   );

//   // Handle minute hand drag
//   const handleMinuteDrag = useCallback(
//     (clientX: number, clientY: number) => {
//       const angle = getAngleFromPosition(clientX, clientY);
//       const newMinute = Math.round(angle / 6) % 60;
//       setMinutes(newMinute);
//     },
//     [getAngleFromPosition],
//   );

//   // Mouse event handlers
//   const handleMouseDown =
//     (type: 'hour' | 'minute') => (e: React.MouseEvent) => {
//       e.preventDefault();
//       if (type === 'hour') {
//         setIsDraggingHour(true);
//       } else {
//         setIsDraggingMinute(true);
//       }
//     };

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isDraggingHour) {
//         handleHourDrag(e.clientX, e.clientY);
//       } else if (isDraggingMinute) {
//         handleMinuteDrag(e.clientX, e.clientY);
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDraggingHour(false);
//       setIsDraggingMinute(false);
//     };

//     if (isDraggingHour || isDraggingMinute) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDraggingHour, isDraggingMinute, handleHourDrag, handleMinuteDrag]);

//   // Handle number click on clock face
//   const handleNumberClick = (number: number) => {
//     const newHour =
//       number === 12 ? (isAM ? 12 : 0) : isAM ? number : number + 12;
//     setHours(newHour);
//   };

//   // Handle input changes
//   const handleHourInputChange = (value: string) => {
//     const num = parseInt(value);
//     if (!isNaN(num) && num >= 1 && num <= 12) {
//       const newHour = num === 12 ? (isAM ? 12 : 0) : isAM ? num : num + 12;
//       setHours(newHour);
//     }
//   };

//   const handleMinuteInputChange = (value: string) => {
//     const num = parseInt(value);
//     if (!isNaN(num) && num >= 0 && num <= 59) {
//       setMinutes(num);
//     }
//   };

//   // Notify parent of time changes
//   useEffect(() => {
//     onTimeChange?.({ hours, minutes, isAM });
//   }, [hours, minutes, isAM, onTimeChange]);

//   return (
//     <Card className="mx-auto w-full max-w-sm shadow-lg">
//       <CardHeader className="pb-4">
//         <CardTitle className="text-primary text-center text-lg font-medium">
//           Select time
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* Digital Time Display */}
//         <div className="flex items-center justify-center gap-2">
//           <Input
//             type="text"
//             value={displayHours.toString().padStart(2, '0')}
//             onChange={(e) => handleHourInputChange(e.target.value)}
//             className={cn(
//               'h-12 w-12 text-center text-2xl font-bold',
//               'bg-time-input text-primary-foreground border-0',
//               'focus:ring-primary focus:ring-2 focus-visible:ring-2',
//               'focus-visible:ring-primary focus-visible:ring-offset-0',
//             )}
//             maxLength={2}
//           />

//           <span className="text-primary text-2xl font-bold">:</span>

//           <Input
//             type="text"
//             value={minutes.toString().padStart(2, '0')}
//             onChange={(e) => handleMinuteInputChange(e.target.value)}
//             className={cn(
//               'h-12 w-12 text-center text-2xl font-bold',
//               'bg-time-input text-primary-foreground border-0',
//               'focus:ring-primary focus:ring-2 focus-visible:ring-2',
//               'focus-visible:ring-primary focus-visible:ring-offset-0',
//             )}
//             maxLength={2}
//           />

//           <div className="ml-2 flex flex-col gap-1">
//             <Badge
//               variant={isAM ? 'default' : 'secondary'}
//               className={cn(
//                 'cursor-pointer px-2 py-1 text-xs transition-colors',
//                 isAM
//                   ? 'bg-primary text-primary-foreground hover:bg-primary/90'
//                   : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
//               )}
//               onClick={() => setIsAM(true)}
//             >
//               AM
//             </Badge>
//             <Badge
//               variant={!isAM ? 'default' : 'secondary'}
//               className={cn(
//                 'cursor-pointer px-2 py-1 text-xs transition-colors',
//                 !isAM
//                   ? 'bg-primary text-primary-foreground hover:bg-primary/90'
//                   : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
//               )}
//               onClick={() => setIsAM(false)}
//             >
//               PM
//             </Badge>
//           </div>
//         </div>

//         {/* Analog Clock */}
//         <div className="flex justify-center">
//           <div className="relative">
//             <svg
//               ref={clockRef}
//               width="240"
//               height="240"
//               viewBox="0 0 240 240"
//               className="cursor-pointer"
//             >
//               {/* Clock face */}
//               <circle
//                 cx="120"
//                 cy="120"
//                 r="110"
//                 fill="hsl(var(--clock-face))"
//                 stroke="hsl(var(--border))"
//                 strokeWidth="2"
//               />

//               {/* Hour numbers */}
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
//                 const angle = (num * 30 - 90) * (Math.PI / 180);
//                 const x = 120 + 90 * Math.cos(angle);
//                 const y = 120 + 90 * Math.sin(angle);

//                 return (
//                   <text
//                     key={num}
//                     x={x}
//                     y={y + 6}
//                     textAnchor="middle"
//                     className={cn(
//                       'text-clock-number cursor-pointer text-lg font-medium',
//                       'hover:text-primary transition-all duration-200 hover:font-bold',
//                     )}
//                     onClick={() => handleNumberClick(num)}
//                   >
//                     {num}
//                   </text>
//                 );
//               })}

//               {/* Hour hand */}
//               <line
//                 x1="120"
//                 y1="120"
//                 x2={hourHand.x}
//                 y2={hourHand.y}
//                 stroke="hsl(var(--clock-hand))"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//                 className="cursor-pointer transition-all duration-200"
//                 onMouseDown={handleMouseDown('hour')}
//               />

//               {/* Minute hand */}
//               <line
//                 x1="120"
//                 y1="120"
//                 x2={minuteHand.x}
//                 y2={minuteHand.y}
//                 stroke="hsl(var(--clock-hand))"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 className="cursor-pointer transition-all duration-200"
//                 onMouseDown={handleMouseDown('minute')}
//               />

//               {/* Center dot */}
//               <circle cx="120" cy="120" r="6" fill="hsl(var(--clock-hand))" />

//               {/* Hour hand handle */}
//               <circle
//                 cx={hourHand.x}
//                 cy={hourHand.y}
//                 r="8"
//                 fill="hsl(var(--clock-hand))"
//                 className="hover:r-10 cursor-pointer transition-all duration-200"
//                 onMouseDown={handleMouseDown('hour')}
//               />

//               {/* Minute hand handle */}
//               <circle
//                 cx={minuteHand.x}
//                 cy={minuteHand.y}
//                 r="6"
//                 fill="hsl(var(--clock-hand))"
//                 className="hover:r-8 cursor-pointer transition-all duration-200"
//                 onMouseDown={handleMouseDown('minute')}
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3 pt-2">
//           <Button variant="outline" onClick={onCancel} className="px-6">
//             Cancel
//           </Button>
//           <Button onClick={onOK} className="px-8">
//             OK
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
