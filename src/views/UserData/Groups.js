import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';

const style = theme => ({
  appBar: {
    // background: '#34465D',
    // color: '#fff',
  },
  list: {
    width: '100%',
    maxWidth: 'inherit',
    // background: '#fff',
  },
  card: {
    display: 'flex',
    // background: '#fff',
    margin: '5vh 0',
    height: '70vh',
  },
  content: {
    flex: '1 0 auto',
    background: theme.palette.background,
    minHeight: '150px',
  },
});
class UserData extends React.Component {
  state = {
    selected: false,
  };
  selectList = () => {
    this.setState({ selected: true });
  };

  render() {
    const { classes } = this.props;
    const list = [
      { group: 'Users' },
      { group: 'Pipelines Taster ' },
      { group: 'group1' },
    ];

    const listItem = list.map((el, i) => {
      return (
        <ListItem key={i} button>
          <ListItemIcon>
            <PersonPinIcon />
          </ListItemIcon>
          <ListItemText inset primary={`${el.group}`} />
        </ListItem>
      );
    });

    return (
      <Grid container>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <Grid container>
              <Grid item xs={12}>
                <AppBar position="static" className={classes.appBar}>
                  <Toolbar>
                    <Typography variant="h6" color="inherit">
                      My Groups
                    </Typography>
                  </Toolbar>
                </AppBar>
                <List component="nav" className={classes.list}>
                  {listItem}
                </List>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

UserData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(UserData);
