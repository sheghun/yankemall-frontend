import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    link: {
        '&:hover': {
            textDecoration: 'underline',
            textDecorationColor: 'gray',
        },
    },
}));

const Copyright = () => {
    const classes = useStyles();

    return (
        <Link to={'/'} className={classes.link}>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                Eromalls
                {new Date().getFullYear()}
            </Typography>
        </Link>
    );
};

export default Copyright;
