import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { SearchResult } from '../types/file-system';
import { formatHotkeyDisplay } from '../hooks/useHotkeys';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  query,
  onQueryChange,
  results,
  onResultClick
}, ref) => {
  const clearSearch = () => {
    onQueryChange('');
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                ref={ref}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search files and folders..."
                className="pl-10 pr-10"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Search {formatHotkeyDisplay('ctrl+f')} • Clear {formatHotkeyDisplay('escape')}</p>
            </TooltipContent>
          </Tooltip>
          {query && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={clearSearch}
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear search {formatHotkeyDisplay('escape')}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

      {query && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </span>
            {results.length > 0 && (
              <Button
                onClick={clearSearch}
                size="sm"
                variant="ghost"
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          {results.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md bg-card p-2">
              {results.map((result, index) => (
                <div
                  key={`${result.item.id}-${index}`}
                  onClick={() => onResultClick?.(result)}
                  className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm">
                      {result.item.type === 'folder' ? '📁' : '📄'}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {result.item.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {result.item.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-48">
                    {result.item.path}
                  </div>
                </div>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground border rounded-md bg-card">
              No items found for "{query}"
            </div>
          )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});
