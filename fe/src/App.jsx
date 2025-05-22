import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import GlobalStyle from './assets/styles/GlobalStyle';
import DynamicRouter from './routes/dynamicRouter';
import { lightTheme, darkTheme } from '../theme';
import { TimetableProvider } from './contexts/TimetableContext';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Quản lý trạng thái theme

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <BrowserRouter>
        <TimetableProvider>
          <DynamicRouter />
        </TimetableProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;