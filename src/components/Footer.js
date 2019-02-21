import React from 'react';

import logo from '../assets/img/linea-logo-mini.png';

export default class Footer extends React.Component {
  openLineaWebSite = () => {
    window.open('http://www.linea.gov.br/', 'linea');
  };

  render() {
    return (
      <footer className="footer bg-inverse">
        <span className="text-white float-left">Developer Portal Instance</span>
        <span className="text-white float-right">
          Powered by{' '}
          <img
            src={logo}
            className="winOpen"
            onClick={this.openLineaWebSite}
            title="LIneA"
            alt="LineA"
          />
        </span>
      </footer>
    );
  }
}
