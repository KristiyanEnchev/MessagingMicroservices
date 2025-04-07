import { cn } from "@/lib/utils";
import { useState } from "react";

type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function Tabs({ items, defaultTabId, className, variant = 'default' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || items[0]?.id);

  if (!items.length) return null;

  const tabsClasses = {
    default: {
      tabs: "flex border-b border-border",
      tab: "px-4 py-2 text-sm font-medium",
      active: "text-primary border-b-2 border-primary",
      inactive: "text-muted-foreground hover:text-foreground hover:bg-muted/60"
    },
    pills: {
      tabs: "flex space-x-2",
      tab: "px-3 py-1.5 text-sm font-medium rounded-md",
      active: "bg-primary text-primary-foreground",
      inactive: "text-foreground bg-transparent hover:bg-muted"
    },
    underline: {
      tabs: "inline-flex h-10 items-center justify-center rounded-md p-1",
      tab: "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background",
      active: "border-b-2 border-primary text-primary",
      inactive: "text-muted-foreground hover:text-foreground"
    }
  };

  const classes = tabsClasses[variant];

  return (
    <div className={className}>
      <div className={classes.tabs}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              classes.tab,
              item.id === activeTab ? classes.active : classes.inactive,
              "transition-colors"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-2">
        {items.find((item) => item.id === activeTab)?.content}
      </div>
    </div>
  );
}