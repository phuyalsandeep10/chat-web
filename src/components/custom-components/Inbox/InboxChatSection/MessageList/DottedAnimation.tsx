interface DottedAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'green' | 'gray' | 'white';
  className?: string;
}

export default function DottedAnimation({
  size = 'md',
  color = 'white',
  className = '',
}: DottedAnimationProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    gray: 'bg-[#939393]',
    white: 'bg-white',
  };

  const dotSize = sizeClasses[size];
  const dotColor = colorClasses[color];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div
        className={`${dotSize} ${dotColor} animate-pulse-fill rounded-full`}
        style={{ animationDelay: '0s' }}
      />
      <div
        className={`${dotSize} ${dotColor} animate-pulse-fill rounded-full`}
        style={{ animationDelay: '0.3s' }}
      />
      <div
        className={`${dotSize} ${dotColor} animate-pulse-fill rounded-full`}
        style={{ animationDelay: '0.6s' }}
      />
    </div>
  );
}
