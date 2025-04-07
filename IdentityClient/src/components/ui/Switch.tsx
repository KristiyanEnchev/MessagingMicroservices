import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex items-center", className)}>
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          {...props}
        />
        <div className="h-6 w-11 rounded-full bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary transition-colors peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <div className="text-sm font-medium text-foreground">{label}</div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground">{description}</div>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
