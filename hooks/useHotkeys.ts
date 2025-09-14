import { useEffect, useCallback } from 'react';

export interface HotkeyConfig {
  key: string;
  action: () => void;
  description: string;
  category?: string;
  preventDefault?: boolean;
}

export interface ParsedHotkey {
  keys: string[];
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
}

const parseHotkey = (hotkey: string): ParsedHotkey => {
  const parts = hotkey.toLowerCase().split('+');
  const modifiers = {
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd'),
  };
  
  const keys = parts.filter(part => 
    !['ctrl', 'shift', 'alt', 'meta', 'cmd'].includes(part)
  );
  
  return { keys, modifiers };
};

const matchesHotkey = (event: KeyboardEvent, parsed: ParsedHotkey): boolean => {
  const { keys, modifiers } = parsed;
  
  // Check modifiers
  if (event.ctrlKey !== modifiers.ctrl) return false;
  if (event.shiftKey !== modifiers.shift) return false;
  if (event.altKey !== modifiers.alt) return false;
  if (event.metaKey !== modifiers.meta) return false;
  
  // Check keys
  const eventKey = event.key.toLowerCase();
  const eventCode = event.code.toLowerCase();
  
  return keys.some(key => {
    if (key === 'space') return eventKey === ' ';
    if (key === 'enter') return eventKey === 'enter';
    if (key === 'escape') return eventKey === 'escape';
    if (key === 'delete') return eventKey === 'delete';
    if (key === 'backspace') return eventKey === 'backspace';
    if (key === 'tab') return eventKey === 'tab';
    if (key.startsWith('f') && key.length > 1) return eventCode === key;
    return eventKey === key;
  });
};

export const useHotkeys = (hotkeys: HotkeyConfig[], enabled = true) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Don't trigger hotkeys when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      // Only allow escape and some specific shortcuts in inputs
      if (!['escape', 'ctrl+a', 'ctrl+f'].some(key => matchesHotkey(event, parseHotkey(key)))) {
        return;
      }
    }
    
    for (const hotkey of hotkeys) {
      const parsed = parseHotkey(hotkey.key);
      if (matchesHotkey(event, parsed)) {
        if (hotkey.preventDefault !== false) {
          event.preventDefault();
        }
        hotkey.action();
        break;
      }
    }
  }, [hotkeys, enabled]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const formatHotkeyDisplay = (hotkey: string): string => {
  return hotkey
    .split('+')
    .map(part => {
      switch (part.toLowerCase()) {
        case 'ctrl': return '⌃';
        case 'shift': return '⇧';
        case 'alt': return '⌥';
        case 'meta':
        case 'cmd': return '⌘';
        case 'enter': return '↵';
        case 'escape': return 'Esc';
        case 'delete': return 'Del';
        case 'backspace': return '⌫';
        case 'space': return 'Space';
        case 'tab': return '⇥';
        default: return part.toUpperCase();
      }
    })
    .join('');
};
