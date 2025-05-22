import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import GlobalStyle from './assets/styles/GlobalStyle';
import DynamicRouter from './routes/dynamicRouter';
import { lightTheme, darkTheme } from '../theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Quản lý trạng thái theme

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <BrowserRouter>
        <DynamicRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;