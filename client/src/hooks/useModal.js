import { useState, useCallback } from 'react';

export function useModal(initialMode = false) {
  const [isOpen, setIsOpen] = useState(initialMode);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle, setIsOpen };
}
