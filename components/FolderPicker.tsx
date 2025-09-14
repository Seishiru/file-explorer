import React from 'react';
import { Folder, RefreshCw, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { formatHotkeyDisplay } from '../hooks/useHotkeys';

interface FolderPickerProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  onRefresh: () => void;
  onDrop?: (files: FileList) => void;
}

export const FolderPicker: React.FC<FolderPickerProps> = ({
  currentPath,
  onPathChange,
  onRefresh,
  onDrop
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const dragCounterRef = React.useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    dragCounterRef.current = 0;
    
    if (onDrop && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  };

  const handleBrowse = async () => {
  if (!window.electronAPI?.prompt) {
    console.warn('electronAPI.prompt not available');
    return;
  }

  const newPath = await window.electronAPI.prompt(
    'Enter folder path:',
    currentPath || 'C:\\Users\\YourName\\Documents'
  );

  if (newPath && newPath.trim()) {
    onPathChange(newPath.trim());
  }
};

  return (
    <TooltipProvider>
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" style={{ color: 'var(--accent-color)' }} />
            Folder Picker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-path">Current Path</Label>
            <div className="flex gap-2">
              <Input
                id="current-path"
                value={currentPath}
                onChange={(e) => onPathChange(e.target.value)}
                placeholder="Enter folder path..."
                className="flex-1"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onRefresh}
                    size="sm"
                    variant="outline"
                    className="px-3"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh {formatHotkeyDisplay('ctrl+r')} or {formatHotkeyDisplay('f5')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragOver 
              ? 'border-[var(--accent-color)] bg-[color-mix(in_srgb,var(--accent-color)_10%,transparent)] scale-[1.02]' 
              : 'border-border hover:border-[var(--accent-color)] hover:bg-[color-mix(in_srgb,var(--accent-color)_5%,transparent)]'
            }`}
          onClick={handleBrowse}
        >
          <div className={`transition-all duration-200 ${isDragOver ? 'scale-110' : ''}`}>
            <Upload className={`h-12 w-12 mx-auto mb-3 transition-colors duration-200 ${
              isDragOver ? 'text-[var(--accent-color)]' : 'text-muted-foreground'
            }`} />
            <p className={`text-base mb-2 transition-colors duration-200 ${
              isDragOver ? 'text-[var(--accent-color)] font-medium' : 'text-foreground'
            }`}>
              {isDragOver ? 'Drop folder here!' : 'Drag & drop a folder here'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse folders
            </p>
          </div>
        </div>

          <Button
            onClick={handleBrowse}
            variant="outline"
            className="w-full hover:bg-[color-mix(in_srgb,var(--accent-color)_10%,transparent)] hover:border-[var(--accent-color)] transition-colors"
          >
            <Folder className="h-4 w-4 mr-2" />
            Browse Folders
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
