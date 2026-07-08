import { useEffect } from 'react';

/**
 * Hook to trigger an action when a specific keyboard shortcut is pressed.
 * E.g., useKeyboardShortcut('k', () => openCommandPalette(), { ctrlKey: true, metaKey: true });
 */
export function useKeyboardShortcut(key, callback, options = {}) {
  useEffect(() => {
    const handler = (event) => {
      // Check for modifier keys
      const ctrlMatch = options.ctrlKey ? event.ctrlKey : true;
      const metaMatch = options.metaKey ? event.metaKey : true;
      const shiftMatch = options.shiftKey ? event.shiftKey : !event.shiftKey;
      const altMatch = options.altKey ? event.altKey : !event.altKey;

      // Special case: if we look for ctrl or meta (like Cmd on Mac), check if either is pressed.
      let modifierMatch = true;
      if (options.ctrlKey && options.metaKey) {
        modifierMatch = event.ctrlKey || event.metaKey;
      } else {
        modifierMatch = ctrlMatch && metaMatch;
      }

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        modifierMatch &&
        shiftMatch &&
        altMatch
      ) {
        event.preventDefault(); // Prevent browser defaults (e.g. searching)
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options]);
}
