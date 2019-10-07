import React from 'react';
import styled from 'styled-components';

/**
 * The top bar component that comes before the nav bar
 * @constructor
 */

const NativeNav = styled.nav`
    border-bottom: solid 1px rgba(0, 0, 0, 0.09);
    & ul {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
        padding: 0;
        max-width: 100%;
    }
    & li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        padding: 0px 4px;
        font-size: 11px;
    }
    & li:hover {
        font-weight: 900;
    }
    & .faint {
        color: rgba(0, 0, 0, 0.5);
    }
    & .caret {
        width: 0;
        height: 0;
        margin-left: 0.3rem;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 4px solid rgba(0, 0, 0, 0.5);
    }
    & .icons {
        font-size: 18px;
        font-weight: 900 !important;
        margin-right: 0.8rem;
    }
    & .money {
        color: rgba(0, 0, 0, 0.4);
        margin-left: 0.8rem;
        margin-right: 1rem;
    }
`;
const TopBar = () => {
    return (
        <NativeNav>
            <ul>
                <li className={'faint'}>
                    EN <div className={'caret'} />
                </li>
                <li className={'faint'}>
                    USD <div className={'caret'} />
                </li>
                <li>
                    <i className={'ion-ios-person-outline icons'} />
                    My Profile
                </li>
            </ul>
        </NativeNav>
    );
};

export default TopBar;
