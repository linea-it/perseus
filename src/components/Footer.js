import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Toolbar } from '@material-ui/core';
import logoLinea from '../assets/img/linea-logo-mini.png';

const styles = {
  root: {
    margin: 0,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    // background: '#34465D',
    // color: '#fff',
    height: '8vh',
  },
  footer: {
    // fontSize: 14,
    margin: 0,
    verticalAlign: 'middle',
  },
  media: {
    widht: '20px',
    height: '20px',
    // flexGrow: 12,
  },
};

class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <footer>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.footer}>
              Developer Portal Instance
            </Typography>
            <figure>
              <img
                alt="Contemplative Reptile"
                className={classes.media}
                src={logoLinea}
                title="Contemplative Reptile"
              />
            </figure>
          </Toolbar>
        </AppBar>
      </footer>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
