import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type AppFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function AppFilters({ searchQuery, onSearchChange }: AppFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
