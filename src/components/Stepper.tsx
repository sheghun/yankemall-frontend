import React from 'react';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MatStepper from '@material-ui/core/Stepper';
import {makeStyles} from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import classNames from 'classnames';
import {Typography} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: `${theme.palette.secondary.main} !important`,
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: theme.palette.secondary.main,
    },
    completed: {
        zIndex: 1,
        fontSize: 18,
    },
}));

const StepIcon = (props: any) => {
    const classes = useStyles();
    const {active, completed} = props;

    return (
        <div className={classes.root}>
            {completed ? (
                <CheckCircleIcon color={'secondary'} className={classes.completed} />
            ) : active ? (
                <div className={classes.circle} />
            ) : (
                <CheckCircleTwoToneIcon />
            )}
        </div>
    );
};

const Stepper = ({activeStep, steps}: {activeStep: number; steps: string[]}) => {
    const classes = useStyles();

    return (
        <MatStepper activeStep={activeStep}>
            {steps.map(label => (
                <Step key={label}>
                    <StepLabel StepIconComponent={StepIcon} classes={{active: classes.active}}>
                        <Typography variant={'overline'}>{label}</Typography>
                    </StepLabel>
                </Step>
            ))}
        </MatStepper>
    );
};

export default Stepper;
