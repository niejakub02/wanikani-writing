import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from '@app/store.ts';
import { ModelProvider } from '@context/ModelContext.tsx';
import { CanvasControlProvider } from '@context/CanvasContext.tsx';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    text: {
      primary: '#fff',
      secondary: '#fff',
      disabled: '#fff',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CanvasControlProvider>
        <ModelProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </ModelProvider>
      </CanvasControlProvider>
    </ThemeProvider>
  </StrictMode>
);
