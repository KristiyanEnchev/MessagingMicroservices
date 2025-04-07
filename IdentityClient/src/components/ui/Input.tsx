import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2.5 py-1.5 text-xs",
        lg: "h-12 px-4 py-3 text-base"
      },
      error: {
        true: "border-destructive focus-visible:ring-destructive",
        false: ""
      }
    },
    defaultVariants: {
      size: "default",
      error: false
    }
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "default" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, size, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              inputVariants({ 
                size, 
                error: Boolean(error),
                className 
              }),
              leftIcon && "pl-10",
              rightIcon && "pr-10"
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };