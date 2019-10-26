import React from 'react';
import styled from 'styled-components';

type Props = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    width: string;
};

const InputNative = styled.input`
    background-color: transparent;
    border: solid 1.5px rgba(255, 255, 255, 0.8);
    border-radius: 2.5%;
    padding: 0.8rem 4px;
    height: 2.8rem;
    color: white;
    font-weight: 600;
    font-size: 14px;
    &:focus {
        outline: none;
    }
    ::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
`;

const Input = ({width, ...rest}: Props) => {
    return (
        <div>
            {
                // @ts-ignore
                <InputNative style={{width: `${width}`}} {...rest} />
            }
        </div>
    );
};

export default Input;
