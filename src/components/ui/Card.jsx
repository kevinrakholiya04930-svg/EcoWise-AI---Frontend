import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  role,
  tabIndex,
  ...props
}) => {
  const interactive = typeof onClick === 'function';

  const handleKeyDown = (e) => {
    if (!interactive) return;

    if (
      e.key === 'Enter' ||
      e.key === ' '
    ) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={
        role ||
        (interactive ? 'button' : undefined)
      }
      tabIndex={
        tabIndex ??
        (interactive ? 0 : undefined)
      }
      className={`
        glass
        rounded-2xl
        p-6
        ${hoverable
          ? 'glass-hover cursor-pointer'
          : ''
        }
        ${interactive
          ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary'
          : ''
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};