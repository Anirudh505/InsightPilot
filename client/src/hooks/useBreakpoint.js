import { useState, useEffect } from 'react';

const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export function useBreakpoint(breakpoint) {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const query = breakpoints[breakpoint];
    if (!query) return;

    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setIsMatch(mediaQueryList.matches);

    // Set initial
    setIsMatch(mediaQueryList.matches);
    
    // Listen for changes
    mediaQueryList.addEventListener('change', documentChangeHandler);
    return () => mediaQueryList.removeEventListener('change', documentChangeHandler);
  }, [breakpoint]);

  return isMatch;
}
