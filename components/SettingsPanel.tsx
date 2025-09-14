import React, { useState } from 'react';
import { Settings, Moon, Sun, Palette, X } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AppSettings } from '../types/file-system';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACCENT_COLORS = [
  { name: 'LINE Green', color: '#06C755' },
  { name: 'LINE Blue', color: '#00B2FF' },
  { name: 'LINE Red', color: '#FF5555' },
  { name: 'LINE Yellow', color: '#FFBB33' },
  { name: 'LINE Purple', color: '#9B59B6' },
  { name: 'LINE Orange', color: '#FF8C42' }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  open,
  onOpenChange
}) => {
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(tempSettings);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    onOpenChange(false);
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your LINE File Explorer experience with theme, colors, and display options.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 -mx-1 dialog-content-scroll">
          <div className="space-y-6 py-4">
          {/* Theme Settings */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Theme
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center gap-2">
                  {tempSettings.theme === 'dark' ? 
                    <Moon className="h-4 w-4" /> : 
                    <Sun className="h-4 w-4" />
                  }
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={tempSettings.theme === 'dark'}
                  onCheckedChange={(checked) => 
                    updateSetting('theme', checked ? 'dark' : 'light')
                  }
                  style={{ 
                    '--accent-color': tempSettings.accentColor 
                  } as React.CSSProperties}
                  className="data-[state=checked]:bg-[var(--accent-color)]"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Accent Color */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Accent Color
            </h3>
            <div className="grid grid-cols-3 gap-3 pl-6">
              {ACCENT_COLORS.map((colorOption) => (
                <div
                  key={colorOption.color}
                  onClick={() => updateSetting('accentColor', colorOption.color)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent ${
                    tempSettings.accentColor === colorOption.color 
                      ? 'border-current ring-2 ring-offset-2' 
                      : 'border-border'
                  }`}
                  style={{
                    borderColor: tempSettings.accentColor === colorOption.color 
                      ? colorOption.color 
                      : undefined,
                    ringColor: tempSettings.accentColor === colorOption.color 
                      ? colorOption.color 
                      : undefined
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: colorOption.color }}
                  />
                  <span className="text-sm">{colorOption.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Display Options</h3>
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-files">Show Files</Label>
                <Switch
                  id="show-files"
                  checked={tempSettings.showFiles}
                  onCheckedChange={(checked) => updateSetting('showFiles', checked)}
                  style={{ 
                    '--accent-color': tempSettings.accentColor 
                  } as React.CSSProperties}
                  className="data-[state=checked]:bg-[var(--accent-color)]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-hidden">Show Hidden Files</Label>
                <Switch
                  id="show-hidden"
                  checked={tempSettings.showHiddenFiles}
                  onCheckedChange={(checked) => updateSetting('showHiddenFiles', checked)}
                  style={{ 
                    '--accent-color': tempSettings.accentColor 
                  } as React.CSSProperties}
                  className="data-[state=checked]:bg-[var(--accent-color)]"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
                <Switch
                  id="auto-refresh"
                  checked={tempSettings.autoRefresh}
                  onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                  style={{ 
                    '--accent-color': tempSettings.accentColor 
                  } as React.CSSProperties}
                  className="data-[state=checked]:bg-[var(--accent-color)]"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Column Width Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Tree Column Widths</h3>
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>Name Column: {tempSettings.treeColumns.name}%</Label>
                <Slider
                  value={[tempSettings.treeColumns.name]}
                  onValueChange={([value]) => 
                    updateSetting('treeColumns', {
                      ...tempSettings.treeColumns,
                      name: value
                    })
                  }
                  max={80}
                  min={30}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Size Column: {tempSettings.treeColumns.size}%</Label>
                <Slider
                  value={[tempSettings.treeColumns.size]}
                  onValueChange={([value]) => 
                    updateSetting('treeColumns', {
                      ...tempSettings.treeColumns,
                      size: value
                    })
                  }
                  max={40}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{ backgroundColor: tempSettings.accentColor }}
            className="text-white hover:opacity-90"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
