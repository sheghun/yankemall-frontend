import React from 'react';
import loadingAnimation from '../assets/images/loading-animation.gif';
import styled from 'styled-components';

const Style = styled.div`
    z-index: 9999999;
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    top: 0;
    & img {
        width: 50px;
        height: 50px;
    }
`;

const Loading = ({show}: {show: boolean}) => {
    return show ? (
        <Style>
            <img alt={'loading'} src={loadingAnimation} />
        </Style>
    ) : (
        <> </>
    );
};

export default Loading;
