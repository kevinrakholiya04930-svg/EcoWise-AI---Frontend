import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-accent-green hover:bg-green-600 text-bg-primary shadow-lg shadow-green-500/20',

    secondary:
      'bg-bg-elevated hover:bg-bg-elevated/80 border border-green-500/20 text-text-primary',

    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',

    ghost:
      'bg-transparent hover:bg-bg-elevated text-text-muted hover:text-text-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">
            Loading
          </span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};