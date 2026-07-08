import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
import { AppRouter } from './routes';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </StrictMode>
);
