import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import theme from '../theme/MaterialTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TableMyProcesses from '../components/TableMyProcesses';

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
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    backgroundColor: theme.palette.background,
  },
  tab: {
    padding: 100,
  },
});

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="static" className={classes.appBar}>
            <Tabs
              value={value}
              indicatorColor="secondary"
              onChange={this.handleChange}
            >
              <Tab label="Table" />
              <Tab label="Item " />
              <Tab label="User" />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <TabContainer>
              <TableMyProcesses />
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer className={classes.tab}>Item Two</TabContainer>
          )}
          {value === 2 && (
            <TabContainer className={classes.tab}>Item Three</TabContainer>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);
