import { createTheme } from "@mui/material/styles";

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#68bfb5',
    contrastText: '#fff',
  },
  background: {
    default: '#f8f9fa',
    paper: '#fff',
  },
  text: {
    primary: '#243139',
    secondary: '#97c0ad',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#68bfb5',
    contrastText: '#fff',
  },
  background: {
    default: '#243139',
    paper: '#1b242a',
  },
  text: {
    primary: '#f8f9fa',
    secondary: '#97c0ad',
  },
};

const getTheme = (mode = 'light') => createTheme({
  palette: mode === 'dark' ? darkPalette : lightPalette,
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 18,
  },
});

const theme = getTheme();
export default theme;