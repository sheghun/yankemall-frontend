import React from 'react';
import styled, {keyframes} from 'styled-components';

const fadeIn = keyframes`
    from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
`;

const fadeOut = keyframes`
 from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
`;

const Snack = styled.div`
    min-width: 250px;
    margin-left: -125px;
    background-color: #ff4252;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
    visibility: visible;
    animation: ${fadeIn} 0.5s, ${fadeOut} 0.5s 2.5s;
`;

const Snackbar = ({
    show,
    message,
    alternate,
}: {
    show: boolean;
    message: any;
    alternate: boolean;
}) => {
    return show ? (
        <Snack style={{backgroundColor: !alternate ? '#ff4252' : 'black'}} id="snackbar">
            {message}
        </Snack>
    ) : null;
};

export default Snackbar;
