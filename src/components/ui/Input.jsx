import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full bg-bg-primary/80 border border-green-500/20 rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-green transition-all duration-200 ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-semibold text-red-400 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
