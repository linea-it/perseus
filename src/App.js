import React, { Component } from 'react';
import Header from './components/Header';
import Workspace from './views/Workspace';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './components/Footer';

const theme = createMuiTheme({
  palette: {
    secondary: indigo,
    primary: {
      light: '#5c6b7d',
      main: '#34465d',
      dark: '#243141',
      contrastText: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <Header />
          <Workspace />
          <Footer />
        </CssBaseline>
      </MuiThemeProvider>
    );
  }
}



export default App;
