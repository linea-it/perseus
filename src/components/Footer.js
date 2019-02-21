import React from 'react';
import PropTypes from 'prop-types';

import logo from '../assets/img/linea-logo-mini.png';

class Footer extends React.Component {
  openLineaWebSite = () => {
    window.open('http://www.linea.gov.br/', 'linea');
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    return (
      <footer className="footer">
        <span className="text-white float-left">Developer Portal Instance</span>
        <span className="text-white float-right">
          Powered by
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

export default Footer;
