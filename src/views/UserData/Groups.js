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
    // background: '#c6c6c6',
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
              {/* <Grid container spacing={20}>
                <Grid item xs={12}>
                  <CardContent className={classes.content}>
                    <Avatar />
                  </CardContent>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.details}>
                    <Typography>Name</Typography>
                    <Typography>Email</Typography>
                    <Typography>Afiliation</Typography>
                    <Typography>Joined</Typography>
                    <Typography>Roles</Typography>
                    <Typography>UserName</Typography>
                  </div>
                </Grid>
              </Grid> */}

              {/* <Grid item xs={12}>
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography>FULANO</Typography>
                    <Typography>FULANO</Typography>
                    <Typography>FULANO</Typography>
                    <Typography>FULANO</Typography>
                  </CardContent>
                </div>
              </Grid> */}
            </Card>
          </Grid>
        </Grid>

        {/* <section className={classes.root}>
          <Grid container spacing={20}>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={9}>
              <Typography>FULANO</Typography>
            </Grid>
          </Grid>
        </section> */}
      </MuiThemeProvider>
    );
  }
}

UserData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(UserData);
