import { render } from 'preact';

import "./style.css"
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import SignupForm from './components/SignupForm';
import { createTheme } from '@mui/material/styles';

export function App() {
  return (
    <div className="flex justify-center my-8 mx-4 bg-white">
      <SignupForm />
    </div>
  );
}

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#037ef3',
    },
    text: {
      secondary: '#575f6e',
      disabled: '#e2e4e5',
    },
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
  },
});

render(
  <StyledEngineProvider enableCssLayer>
    <ThemeProvider theme={theme}>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <App />
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('aiesec-signup-form')!
);
