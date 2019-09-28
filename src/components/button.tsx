import React from 'react';
import styled from 'styled-components';

type props = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {};

const Buton = styled.button`
    background-color: black;
    border: none;
    color: white;
    padding: 1rem 5rem;
    font-family: 'Lato';
`;

const Button = ({children}: props) => {
    return (
        <>
            <Buton>{children}</Buton>
        </>
    );
};

export default Button;
