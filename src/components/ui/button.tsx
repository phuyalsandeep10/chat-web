'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[var(--color-ring)] focus-visible:ring-[var(--color-ring)]/50 focus-visible:ring-[3px] aria-invalid:ring-[var(--color-destructive)]/20 dark:aria-invalid:ring-[var(--color-destructive)]/40 aria-invalid:border-[var(--color-destructive)] w-fit px-[12px] py-[6px]",
  {
    variants: {
      variant: {
        default: `
          bg-brand-primary
          text-white
          hover:bg-brand-hover
          active:bg-brand-pressed
          disabled:bg-brand-disable
          disabled:text-theme-text-primary
          disabled:cursor-not-allowed
          focus:outline-none focus:ring-0 focus:ring-offset-0
          font-semibold
          text-[16px]
        `,
        destructive:
          'bg-alert-prominent text-white focus:outline-none focus:ring-0 focus:ring-offset-0 font-semibold text-[16px]',
        outline: `
          border border-brand-primary
          bg-transparent
          text-brand-primary
          hover:bg-secondary-hover
          hover:text-accent-foreground
          disabled:bg-brand-disable
          disabled:text-theme-text-primary
          dark:bg-[var(--color-input)/30]
          dark:border-[var(--color-input)]
          dark:hover:bg-[var(--color-input)/50]
          focus:outline-none focus:ring-0 focus:ring-offset-0
          font-semibold
          text-[16px]
        `,
        outline_gray: `
          border border-gray-primary
          bg-transparent
          text-gray-primary
          offset-0
          font-semibold
          text-xs
        `,
        outline_black: `border border-black bg-transparent text-black w-fit text-xs`,
        black: `border border-theme-text-light bg-black text-white w-fit`,
        secondary: `
          border-2 border-brand-primary
          bg-transparent
          text-brand-primary
          hover:bg-secondary-hover
          hover:text-brand-primary
          disabled:border border-secondary-disabled
          disabled:text-secondary-disabled
          focus:outline-none focus:ring-0 focus:ring-offset-0
          font-semibold
          text-[15px]
        `,
        disabled: `bg-brand-disable text-theme-text-primary`,
        success: `bg-success text-white focus:outline-none focus:ring-0 focus:ring-offset-0 font-semibold
          text-[16px]`,
        ghost:
          'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] dark:hover:bg-[var(--color-accent)/50]',
        link: 'text-brand-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-[8px] gap-1.5 has-[>svg]:px-2.5',
        md: 'h-[48px] rounded-[8px] has-[>svg]:px-2.5',
        lg: 'h-[60px] rounded-[8px] has-[>svg]:px-2.5',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="mr-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-1">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
