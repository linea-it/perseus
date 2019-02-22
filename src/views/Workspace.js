import React, { Component } from 'react';
import PropTypes from 'prop-types';
import theme from '../theme/MaterialTheme';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import SimpleTabs from '../components/Tabs.js';

const styles = {
  root: {
    flexGrow: 1,
    background:'#c6c6c6',
    height: '100vh',
    overflowY: 'hidden',
  },
  container: {
    margin: '100px 5%',
    widht: '90%',
    height: '680px',
    background:'inherit',
  },
  grow: {
    flexGrow: 1,
  },
};

class Workspace extends Component {
  state = {
    value: 0,
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
        <section className={classes.root}>
         <div className={classes.container}>
          <SimpleTabs />
         </div>    
        </section>
    );
  }
}


export default withStyles(styles)(Workspace);
