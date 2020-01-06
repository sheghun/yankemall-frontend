import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import logo from '../assets/images/eromalls-logo.png';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        outline: 'none',
        position: 'relative',
        maxWidth: '720px',
    },
    text: {
        color: 'rgba(0, 0, 0, 0.7) !important',
        padding: '0 4rem',
    },
    icon: {
        position: 'absolute',
    },
    [theme.breakpoints.down('xs')]: {
        paper: {
            width: '90vw',
            height: '80vh',
            overflow: 'scroll',
            padding: '0',
        },
    },
}));

const TransitionsModal = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        window.addEventListener('loadend', handleOpen);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={() => {}}
                style={{outline: 'none'}}
                closeAfterTransition
                disableAutoFocus={true}
                hideBackdrop={true}
            >
                <Slide direction={'down'} in={open}>
                    <Paper className={classes.paper} elevation={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container justify={'center'}>
                                    <Grid item>
                                        <img src={logo} height={74} alt={'Eromalls Logo'} />
                                    </Grid>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant={'body1'}
                                        align={'center'}
                                        className={classes.text}
                                    >
                                        Eromalls is a shopping app that makes shopping easier for
                                        you.
                                        <Divider style={{margin: '2rem 0'}} />
                                        <Typography
                                            variant={'h6'}
                                            style={{fontWeight: 600}}
                                            align={'center'}
                                            color={'secondary'}
                                            gutterBottom
                                        >
                                            How does it work
                                        </Typography>
                                        All you need to do is download our chrome extension select a
                                        site from our supported list of sites, add your items to
                                        cart you will see a popup from our extension click it to
                                        checkout and we will have the items shipped to you in no
                                        time
                                        <Divider style={{margin: '2rem 0'}} />
                                        <Typography
                                            variant={'h6'}
                                            style={{fontWeight: 600}}
                                            color={'secondary'}
                                            align={'center'}
                                            gutterBottom
                                        >
                                            Why?
                                        </Typography>
                                        At times if you want to buy items from these sites you may
                                        be told seller does not ship to your destination, well if
                                        you use our extension we handle the shipping to you, so no
                                        matter the product you add to cart it will always be shipped
                                        to you
                                    </Typography>
                                    <Grid container justify={'center'}>
                                        <Button
                                            style={{marginTop: '2rem'}}
                                            variant={'contained'}
                                            color={'secondary'}
                                            onClick={handleClose}
                                        >
                                            Close
                                        </Button>
                                    </Grid>
                                    <Grid container justify={'center'}>
                                        <a
                                            target={'_blank'}
                                            href={
                                                'https://chrome.google.com/webstore/detail/eromalls/nikondefdlgokmjgmigjjpppfmpalick'
                                            }
                                        >
                                            <Button style={{marginTop: '2rem'}} color={'primary'}>
                                                Download Our Extension
                                            </Button>
                                        </a>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Slide>
            </Modal>
        </div>
    );
};

export default TransitionsModal;
