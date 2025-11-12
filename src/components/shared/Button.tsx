'use client';

import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText = 'Loading...',
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-lg
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200 ease-in-out
      transform hover:scale-105 active:scale-95
    `;

    const sizeClasses = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-2 text-base',
      xl: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      primary: `
        bg-blue-600 text-white border border-transparent
        hover:bg-blue-700 focus:ring-blue-500
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-gray-600 text-white border border-transparent
        hover:bg-gray-700 focus:ring-gray-500
        shadow-sm hover:shadow-md
      `,
      success: `
        bg-green-600 text-white border border-transparent
        hover:bg-green-700 focus:ring-green-500
        shadow-sm hover:shadow-md
      `,
      danger: `
        bg-red-600 text-white border border-transparent
        hover:bg-red-700 focus:ring-red-500
        shadow-sm hover:shadow-md
      `,
      warning: `
        bg-yellow-600 text-white border border-transparent
        hover:bg-yellow-700 focus:ring-yellow-500
        shadow-sm hover:shadow-md
      `,
      outline: `
        bg-white text-gray-700 border border-gray-300
        hover:bg-gray-50 focus:ring-blue-500
        shadow-sm hover:shadow-md
      `,
      ghost: `
        bg-transparent text-gray-700 border border-transparent
        hover:bg-gray-100 focus:ring-gray-500
      `
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${widthClass}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" color="white" className="mr-2" />
            {loadingText}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Icon Button Component
interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'ghost', className = '', ...props }, ref) => {
    const iconSizeClasses = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3'
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={`${iconSizeClasses[size]} ${className}`}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// Button Group Component
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ButtonGroup({ 
  children, 
  className = '', 
  orientation = 'horizontal',
  size = 'md'
}: ButtonGroupProps) {
  const orientationClasses = orientation === 'horizontal' 
    ? 'flex-row -space-x-px' 
    : 'flex-col -space-y-px';

  return (
    <div className={`inline-flex ${orientationClasses} ${className}`}>
      {children}
    </div>
  );
}

// Link Button Component (styled like button but uses Link)
interface LinkButtonProps extends ButtonProps {
  href: string;
  target?: string;
  rel?: string;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ href, target, rel, children, ...buttonProps }, ref) => {
    // Remove button-specific props
    const { loading, loadingText, onClick, type, ...linkProps } = buttonProps;

    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        className={`
          inline-flex items-center justify-center font-medium rounded-lg
          focus:outline-none focus:ring-2 focus:ring-offset-2
          transition-all duration-200 ease-in-out
          transform hover:scale-105 active:scale-95
          no-underline
          ${linkProps.className || ''}
        `}
        {...(linkProps as any)}
      >
        {children}
      </a>
    );
  }
);

LinkButton.displayName = 'LinkButton';

// Floating Action Button
interface FABProps extends Omit<ButtonProps, 'variant' | 'size'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({ 
  position = 'bottom-right',
  className = '',
  children,
  ...props 
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <Button
      variant="primary"
      size="lg"
      className={`
        ${positionClasses[position]}
        rounded-full shadow-lg hover:shadow-xl
        z-50 w-14 h-14 p-0
        ${className}
      `}
      {...props}
    >
      {children}
    </Button>
  );
}