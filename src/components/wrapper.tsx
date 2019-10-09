import React from 'react';
import {Helmet} from 'react-helmet';

const Wrapper = ({children}: any) => {
    return (
        <>
            <Helmet>
                <title>Home</title>
                <link
                    href={'http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'}
                    rel={'stylesheet'}
                />
            </Helmet>
            {children}
        </>
    );
};

export default Wrapper;
