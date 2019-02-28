import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import theme from '../theme/MaterialTheme';

import logo from '../assets/img/icon-des.png';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <header className={classes.root}>
          <AppBar>
            <Toolbar>
              <IconButton color="inherit" aria-label="Menu">
                <img src={logo} alt="Portal" />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Workspace
              </Typography>
            </Toolbar>
          </AppBar>
        </header>
      </MuiThemeProvider>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
