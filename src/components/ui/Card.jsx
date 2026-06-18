import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-6 ${hoverable ? 'glass-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
