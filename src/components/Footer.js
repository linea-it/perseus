import React, { Component } from 'react';
import PropTypes from 'prop-types';
import theme from '../theme/MaterialTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Toolbar } from '@material-ui/core';
import logoLinea from '../assets/img/linea-logo-mini.png'
import CardMedia from '@material-ui/core/CardMedia';

const styles = {
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    footer: {
        fontSize: 14,
    },
    media: {
        widht: '20px',
        height: '20px',
        flexGrow: 12,
    }
};

class Footer extends Component {

    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <footer>
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography
                                variant="h6"
                                color="inherit"
                                className={classes.footer}
                            >Developer Portal Instance
                            </Typography>
                            <figure>
                                <img
                                    alt="Contemplative Reptile"
                                    className={classes.media}
                                    src={logoLinea}
                                    title="Contemplative Reptile"
                                />
                            </figure>
                        </Toolbar>
                    </AppBar>
                </footer>
            </MuiThemeProvider>

        );
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
