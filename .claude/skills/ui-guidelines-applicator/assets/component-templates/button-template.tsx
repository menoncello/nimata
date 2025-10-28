import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-semibold',
      'rounded-md',
      'transition-colors',
      'duration-150',
      'ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-primary-500',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      primary: [
        'bg-primary-600',
        'text-white',
        'hover:bg-primary-700',
        'active:bg-primary-800',
        'focus:ring-primary-500',
      ],
      secondary: [
        'bg-gray-100',
        'text-gray-900',
        'hover:bg-gray-200',
        'active:bg-gray-300',
        'focus:ring-gray-500',
      ],
      outline: [
        'border',
        'border-gray-300',
        'bg-white',
        'text-gray-700',
        'hover:bg-gray-50',
        'active:bg-gray-100',
        'focus:ring-primary-500',
      ],
      ghost: ['text-gray-700', 'hover:bg-gray-100', 'active:bg-gray-200', 'focus:ring-primary-500'],
    };

    const sizeClasses = {
      sm: ['px-3', 'py-1.5', 'text-sm', 'min-h-[32px]'],
      md: ['px-4', 'py-2', 'text-base', 'min-h-[40px]'],
      lg: ['px-6', 'py-3', 'text-lg', 'min-h-[48px]'],
    };

    const classes = cn(...baseClasses, ...variantClasses[variant], ...sizeClasses[size], className);

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
