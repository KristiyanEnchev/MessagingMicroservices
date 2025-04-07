import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
}

export function Avatar({ 
  src, 
  alt, 
  initials, 
  size = "md", 
  status,
  className,
  ...props 
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  const statusClasses = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    away: "bg-amber-500",
    busy: "bg-rose-500"
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-muted",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full rounded-full object-cover"
          />
        ) : initials ? (
          <span className="font-medium text-foreground">{initials}</span>
        ) : (
          <User className="h-1/2 w-1/2 text-foreground" />
        )}
      </div>
      
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            statusClasses[status],
            size === "sm" ? "h-2 w-2" : "h-3 w-3"
          )}
        />
      )}
    </div>
  );
}