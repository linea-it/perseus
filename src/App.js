import React, { Component } from 'react';
import Header from './components/Header';
import Workspace from './views/Workspace';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Workspace />
        <Footer />
      </div>
    );
  }
}

export default App;
