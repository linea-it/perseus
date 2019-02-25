import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';
import DefaultAvatar from '../assets/img/index.jpeg';
import Grid from '@material-ui/core/Grid';

const styles = {
  bigAvatar: {
    marginTop: 15,
    marginLeft: 55,
    position: 'absolute',
    width: 160,
    height: 160,
    border: '5px solid #ffffff',
    boxShadow: '1px 1px 1px 1px #c6c6c6',
  },
  nameAvatar: {
    marginTop: 150,
    color: '#fff',
    fontSize: '1.6rem',
  },
};

function ImageAvatars(props) {
  const { classes } = props;
  return (
    <Grid container alignItems="center" spacing={0}>
      <Grid item xs={6}>
        <Avatar
          alt="Remy Sharp"
          src={DefaultAvatar}
          className={classes.bigAvatar}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.nameAvatar}>John Doe</Typography>
      </Grid>
    </Grid>
  );
}

ImageAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageAvatars);
