import React from 'react';
// @ts-ignore
import JSXStyle from 'styled-jsx/style';

const Wrapper = ({children}: any) => {
    return (
        <>
            <head>
                <title>Home</title>
                <link
                    href={'http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'}
                    rel={'stylesheet'}
                />
                <link
                    href="https://fonts.googleapis.com/css?family=Lato|Open+Sans|Quicksand&display=swap"
                    rel="stylesheet"
                />
            </head>
            {children}
            <JSXStyle jsx>{`
                :global(body) {
                    margin: 0;
                    font-size: 16px;
                    font-family: 'Lato', sans-serif !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-sizing: border-box !important;
                }
            `}</JSXStyle>
        </>
    );
};

export default Wrapper;
