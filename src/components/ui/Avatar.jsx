import React from 'react';

export const Avatar = ({
  name = 'Eco User',
  size = 'md',
  className = '',
  ...props
}) => {
  const getInitials = (n) => {
    return n
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-xl"
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-lime/20 border border-accent-green/30 text-accent-green font-bold ${sizes[size]} ${className}`}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
};
