import React, { forwardRef, useId } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      className = '',
      id,
      required = false,
      helperText,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = [
      helperText ? helperId : null,
      error ? errorId : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
            {required && (
              <span
                className="ml-1 text-red-400"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={
            describedBy.length ? describedBy : undefined
          }
          className={`w-full bg-bg-primary/80 border border-green-500/20 rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/30 transition-all duration-200 ${
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
              : ''
          } ${className}`}
          {...props}
        />

        {helperText && (
          <p
            id={helperId}
            className="text-xs text-text-muted"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-xs font-semibold text-red-400 mt-0.5"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';