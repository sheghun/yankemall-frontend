import {createMuiTheme} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
    palette: {
        error: red,
        primary: {
            main: '#D10065',
        },
        secondary: {
            main: '#FCBF00',
        },
    },
    typography: {
        body1: {
            color: '#282828',
            fontSize: '14px',
            lineHeight: '2em',
        },
        body2: {
            color: '#202124',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '1.7em',
        },
        fontFamily: 'Lato',
    },
});

export default theme;
