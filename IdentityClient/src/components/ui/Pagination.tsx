import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const renderPaginationButtons = () => {
    const buttons = [];
    
    buttons.push(
      <button
        key="prev"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 flex items-center justify-center rounded-md text-foreground hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );

    const createPageButton = (pageNumber: number, active: boolean = false) => (
      <button
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        className={cn(
          "h-8 w-8 flex items-center justify-center rounded-md",
          active 
            ? "bg-primary text-primary-foreground" 
            : "text-foreground hover:bg-muted"
        )}
      >
        {pageNumber}
      </button>
    );

    const createEllipsis = (key: string) => (
      <span 
        key={key} 
        className="h-8 w-8 flex items-center justify-center text-muted-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
      </span>
    );

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(createPageButton(i, i === currentPage));
      }
    } else {
      buttons.push(createPageButton(1, currentPage === 1));
      
      if (currentPage > 3) {
        buttons.push(createEllipsis('start-ellipsis'));
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(createPageButton(i, i === currentPage));
      }
      
      if (currentPage < totalPages - 2) {
        buttons.push(createEllipsis('end-ellipsis'));
      }
      
      buttons.push(createPageButton(totalPages, currentPage === totalPages));
    }

    buttons.push(
      <button
        key="next"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8 w-8 flex items-center justify-center rounded-md text-foreground hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    );
    
    return buttons;
  };

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      {renderPaginationButtons()}
    </div>
  );
}