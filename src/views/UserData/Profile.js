import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import theme from '../../theme/MaterialTheme';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '../../components/Avatar';
import { Typography } from '@material-ui/core';

const style = {
  card: {
    display: 'flex',
    background: '#fff',
    margin: '5vh 0',
    height: '70vh',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    background: theme.palette.background,
    minHeight: '150px',
  },
};
class UserData extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <Grid item xs={12}>
                <CardContent className={classes.content}>
                  <Avatar />
                </CardContent>
              </Grid>
              
            </Card>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

UserData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(UserData);
