import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SimpleTabs from '../components/Tabs.js';

const styles = {
  root: {
    flexGrow: 1,
    background: '#DCDCDC',
    height: '95vh',
    overflowY: 'hidden',
  },
  container: {
    width: '100%',
    background: 'inherit',
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

    return (
      <section className={classes.root}>
        <div className={classes.container}>
          <SimpleTabs />
        </div>
      </section>
    );
  }
}

Workspace.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Workspace);
