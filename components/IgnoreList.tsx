import React, { useState } from 'react';
import { X, Plus, EyeOff, Save, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { IgnoreRule } from '../types/file-system';

interface IgnoreListProps {
  ignoreRules: IgnoreRule[];
  onIgnoreRulesChange: (rules: IgnoreRule[]) => void;
}

export const IgnoreList: React.FC<IgnoreListProps> = ({
  ignoreRules,
  onIgnoreRulesChange
}) => {
  const [newRule, setNewRule] = useState('');

  const addRule = () => {
    if (newRule.trim() && !ignoreRules.some(rule => rule.pattern === newRule.trim())) {
      const rule: IgnoreRule = {
        name: newRule.trim(),
        pattern: newRule.trim(),
        enabled: true
      };
      onIgnoreRulesChange([...ignoreRules, rule]);
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    const newRules = [...ignoreRules];
    newRules.splice(index, 1);
    onIgnoreRulesChange(newRules);
  };

  const toggleRule = (index: number) => {
    const newRules = [...ignoreRules];
    newRules[index] = { ...newRules[index], enabled: !newRules[index].enabled };
    onIgnoreRulesChange(newRules);
  };

  const saveIgnoreList = () => {
    const dataStr = JSON.stringify(ignoreRules, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ignore-rules.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const loadIgnoreList = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const rules = JSON.parse(event.target?.result as string);
            if (Array.isArray(rules)) {
              onIgnoreRulesChange(rules);
            }
          } catch (error) {
            alert('Error loading ignore list file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-[#06C755]" />
            Ignore Folders
          </div>
          <div className="flex gap-1">
            <Button
              onClick={saveIgnoreList}
              size="sm"
              variant="ghost"
              className="p-2"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              onClick={loadIgnoreList}
              size="sm"
              variant="ghost"
              className="p-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-rule">Add Ignore Pattern</Label>
          <div className="flex gap-2">
            <Input
              id="new-rule"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="e.g., node_modules, .git"
              onKeyPress={(e) => e.key === 'Enter' && addRule()}
              className="flex-1"
            />
            <Button onClick={addRule} size="sm" className="px-3">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Current Rules ({ignoreRules.filter(r => r.enabled).length} active)</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {ignoreRules.map((rule, index) => (
              <div
                key={`${rule.pattern}-${index}`}
                className="flex items-center justify-between p-2 rounded-md border bg-card"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(index)}
                    className="data-[state=checked]:bg-[#06C755]"
                  />
                  <Badge
                    variant={rule.enabled ? "default" : "secondary"}
                    className={rule.enabled ? "bg-[#06C755] hover:bg-[#06C755]/90" : ""}
                  >
                    {rule.name}
                  </Badge>
                </div>
                <Button
                  onClick={() => removeRule(index)}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {ignoreRules.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No ignore rules defined
          </p>
        )}
      </CardContent>
    </Card>
  );
};
