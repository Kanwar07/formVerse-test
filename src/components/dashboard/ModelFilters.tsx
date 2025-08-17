import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, ArrowUpDown, X } from "lucide-react";

interface FilterOptions {
  status?: 'all' | 'published' | 'draft';
  category?: string;
}

interface SortOptions {
  field: 'created_at' | 'name' | 'printability_score' | 'downloads' | 'revenue';
  direction: 'asc' | 'desc';
}

interface ModelFiltersProps {
  filters: FilterOptions;
  sort: SortOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  onClearFilters: () => void;
}

export const ModelFilters = ({ 
  filters, 
  sort, 
  onFiltersChange, 
  onSortChange, 
  onClearFilters 
}: ModelFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categories = [
    "Mechanical",
    "Architecture", 
    "Medical",
    "Automotive",
    "Electronics",
    "Jewelry",
    "Toys",
    "Art",
    "Tools",
    "Other"
  ];

  const sortOptions = [
    { field: 'created_at' as const, label: 'Date Created' },
    { field: 'name' as const, label: 'Name' },
    { field: 'printability_score' as const, label: 'Printability Score' },
    { field: 'downloads' as const, label: 'Downloads' },
    { field: 'revenue' as const, label: 'Revenue' }
  ];

  const hasActiveFilters = filters.status !== 'all' || (filters.category && filters.category !== 'all');

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.field === sort.field);
    return `${option?.label} (${sort.direction === 'asc' ? 'A-Z' : 'Z-A'})`;
  };

  return (
    <div className="flex gap-2 items-center">
      {hasActiveFilters && (
        <div className="flex gap-1 items-center">
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onFiltersChange({ ...filters, status: 'all' })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.category && filters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onFiltersChange({ ...filters, category: 'all' })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {(filters.status !== 'all' ? 1 : 0) + (filters.category && filters.category !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => onFiltersChange({ ...filters, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort: {getSortLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sort by</label>
              <Select
                value={sort.field}
                onValueChange={(field) => onSortChange({ ...sort, field: field as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.field} value={option.field}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Direction</label>
              <Select
                value={sort.direction}
                onValueChange={(direction) => onSortChange({ ...sort, direction: direction as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">High to Low</SelectItem>
                  <SelectItem value="asc">Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};