import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  colorClass?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  className,
  colorClass = "bg-primary/10 text-primary"
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("bg-card p-6 rounded-lg border border-border shadow-sm", className)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span 
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", colorClass)}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}