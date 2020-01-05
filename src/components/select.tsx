import React from 'react';
import styled from 'styled-components';

type props = React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
> & {
    options: any;
    width: string;
};

const NativeSelect = styled.select`
    background-color: transparent;
    border: solid 1px rgba(0, 0, 0, 0.5);
    border-radius: 2.5%;
    padding: 0.8rem 4px;
    height: 2.8rem;
    color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
    font-weight: 600;
    &:focus {
        outline: none;
    }
`;

const Select = ({options, width, ...rest}: props) => {
    return (
        <>
            {
                // @ts-ignore
                <NativeSelect style={{width: `${width}`}} {...rest}>
                    {options}
                </NativeSelect>
            }
        </>
    );
};

export default Select;
