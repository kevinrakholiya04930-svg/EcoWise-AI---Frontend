import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content box */}
      <Card className={`relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 border border-green-500/25 ${className}`}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-green-500/10">
          <h3 className="text-xl font-bold text-text-primary">
            {title}
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="!p-1 text-text-muted hover:text-text-primary text-xl leading-none"
          >
            &times;
          </Button>
        </div>
        <div>
          {children}
        </div>
      </Card>
    </div>
  );
};
