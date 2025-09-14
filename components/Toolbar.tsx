import React from 'react';
import { Expand, Minimize, Eye, EyeOff, Download, FileText, Settings, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { formatHotkeyDisplay } from '../hooks/useHotkeys';

interface ToolbarProps {
  showFiles: boolean;
  onShowFilesChange: (show: boolean) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onExportJSON: () => void;
  onExportText: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  showFiles,
  onShowFilesChange,
  onExpandAll,
  onCollapseAll,
  onExportJSON,
  onExportText,
  onOpenSettings,
  onOpenHelp
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-3 border-b bg-card">
        <div className="flex items-center gap-4">
          {/* Tree Controls */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onExpandAll}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Expand className="h-4 w-4" />
                  Expand All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expand all folders {formatHotkeyDisplay('ctrl+e')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onCollapseAll}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Minimize className="h-4 w-4" />
                  Collapse All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Collapse all folders {formatHotkeyDisplay('ctrl+shift+e')}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Options */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-files"
                    checked={showFiles}
                    onCheckedChange={onShowFilesChange}
                    className="data-[state=checked]:bg-[var(--accent-color)]"
                  />
                  <Label htmlFor="show-files" className="flex items-center gap-1 text-sm cursor-pointer">
                    {showFiles ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    Show Files
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle show/hide files {formatHotkeyDisplay('ctrl+h')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportJSON}>
                <FileText className="h-4 w-4 mr-2" />
                Export as JSON
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatHotkeyDisplay('ctrl+shift+j')}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportText}>
                <FileText className="h-4 w-4 mr-2" />
                Export as Text
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatHotkeyDisplay('ctrl+shift+t')}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onOpenSettings}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open settings {formatHotkeyDisplay('ctrl+comma')}</p>
            </TooltipContent>
          </Tooltip>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onOpenHelp}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show keyboard shortcuts {formatHotkeyDisplay('f1')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
