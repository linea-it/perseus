import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Toolbar } from '@material-ui/core';
import logoLinea from '../assets/img/linea-logo-mini.png';

const styles = {
  root: {
    margin: 0,
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    height: '8vh',
  },
};

class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography
              variant="subtitle1"
              color="inherit"
              className={classes.grow}
            >
              Developer Portal Instance
            </Typography>
            <Typography variant="subtitle1" color="inherit">
              Powered by LIneA
            </Typography>
            <figure>
              <img
                alt="Contemplative Reptile"
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
