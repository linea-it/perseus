import React, { Component } from 'react';
import Header from './components/Header';
import Workspace from './views/Workspace';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <CssBaseline>
        <Header />
        <Workspace />
        <Footer />
      </CssBaseline>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default App;
