import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { Toaster } from 'react-hot-toast';

export function AppProvider({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="insightpilot-theme">
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            className: 'bg-background text-foreground border border-border shadow-glass',
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
