import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import GlobalStyle from './assets/styles/GlobalStyle';
import DynamicRouter from './routes/dynamicRouter';
import { lightTheme, darkTheme } from '../theme';
import { TimetableProvider } from './contexts/TimetableContext';
import ThemeWrapper from '../themeWrapper';



function App() {
  useEffect(() => {
    document.body.classList.add("theme-loaded");
  }, []);

  return (
    <ThemeWrapper>
      <GlobalStyle />
      <BrowserRouter>
        <TimetableProvider>
          <DynamicRouter />
        </TimetableProvider>
      </BrowserRouter>
    </ThemeWrapper>
  );
}

export default App;