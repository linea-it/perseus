import React from 'react';
import Grid from '@material-ui/core/Grid';
import theme from '../../theme/MaterialTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Profile from './Profile';
import Groups from './Groups';

class UserData extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={24}
        >
          <Grid item xs={4}>
            <Profile />
          </Grid>
          <Grid item xs={4}>
            <Groups />
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default UserData;
