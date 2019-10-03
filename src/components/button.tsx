import React from 'react';
import styled from 'styled-components';

type props = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    color: string;
};

const Buton = styled.button`
    background-color: black;
    border: none;
    font-size: 16px;
    color: white;
    cursor: pointer;
    padding: 1rem 5rem;
    font-family: 'Lato';
    &:focus {
        outline: none;
    }
`;

const Button = ({children, color, ...restProps}: props) => {
    return (
        <>
            {
                // @ts-ignore
                <Buton {...restProps} style={{backgroundColor: color}}>
                    {children}
                </Buton>
            }
        </>
    );
};

export default Button;
