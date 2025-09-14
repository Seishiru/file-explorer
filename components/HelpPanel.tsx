import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { formatHotkeyDisplay, HotkeyConfig } from '../hooks/useHotkeys';
import { HelpCircle } from 'lucide-react';

interface HelpPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotkeys: HotkeyConfig[];
}

export const HelpPanel: React.FC<HelpPanelProps> = ({
  open,
  onOpenChange,
  hotkeys
}) => {
  // Group hotkeys by category
  const groupedHotkeys = hotkeys.reduce((groups, hotkey) => {
    const category = hotkey.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(hotkey);
    return groups;
  }, {} as Record<string, HotkeyConfig[]>);

  const categoryOrder = ['Navigation', 'View', 'Search', 'Bookmarks', 'General'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {categoryOrder.map(categoryName => {
            const categoryHotkeys = groupedHotkeys[categoryName];
            if (!categoryHotkeys) return null;

            return (
              <div key={categoryName}>
                <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  {categoryName}
                </h3>
                <div className="space-y-2">
                  {categoryHotkeys.map((hotkey, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm">{hotkey.description}</span>
                      <Badge 
                        variant="outline" 
                        className="font-mono text-xs border-accent-color/20"
                        style={{ color: 'var(--accent-color)' }}
                      >
                        {formatHotkeyDisplay(hotkey.key)}
                      </Badge>
                    </div>
                  ))}
                </div>
                {categoryName !== categoryOrder[categoryOrder.length - 1] && (
                  <Separator className="mt-4" />
                )}
              </div>
            );
          })}

          {/* Additional categories not in the order */}
          {Object.keys(groupedHotkeys)
            .filter(category => !categoryOrder.includes(category))
            .map(categoryName => {
              const categoryHotkeys = groupedHotkeys[categoryName];
              return (
                <div key={categoryName}>
                  <Separator className="mb-4" />
                  <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    {categoryName}
                  </h3>
                  <div className="space-y-2">
                    {categoryHotkeys.map((hotkey, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                      >
                        <span className="text-sm">{hotkey.description}</span>
                        <Badge 
                          variant="outline" 
                          className="font-mono text-xs border-accent-color/20"
                          style={{ color: 'var(--accent-color)' }}
                        >
                          {formatHotkeyDisplay(hotkey.key)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Most shortcuts work globally within the application. 
            When typing in search or input fields, use <Badge variant="outline" className="mx-1 text-xs">Esc</Badge> to return focus to the main interface.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
