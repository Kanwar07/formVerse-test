import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModelsPaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export const ModelsPagination = ({ currentPage, hasMore, onPageChange, loading }: ModelsPaginationProps) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage}
      </span>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore || loading}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};