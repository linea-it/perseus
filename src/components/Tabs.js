import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import UserData from '../views/UserData/UserData';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    // backgroundColor: '#445C7A',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },

  tab: {
    // padding: 50,
    margin: 0,
    padding: 0,
  },
});

class SimpleTabs extends React.Component {
  state = {
    value: 3,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          value={value}
          className={classes.tabs}
          indicatorColor="primary"
          onChange={this.handleChange}
        >
          <Tab label="My Process" />
          <Tab label="My Comments" />
          <Tab label="My Developer Zone" />
          <Tab label="My Profile" />
        </Tabs>
        {value === 0 && (
          <TabContainer>
            <div className={classes.tab}>Text</div>
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer className={classes.tab}>Item Two</TabContainer>
        )}
        {value === 2 && (
          <TabContainer className={classes.tab}>Item Two</TabContainer>
        )}
        {value === 3 && (
          <TabContainer className={classes.tab}>
            <UserData />
          </TabContainer>
        )}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);
