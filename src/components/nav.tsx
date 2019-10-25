import React from 'react';
import TopBar from './topbar';
import logo from '../assets/images/eromalls-logo.png';
import styled from 'styled-components';
import {Link} from 'react-scroll';
import {Link as RouterLink} from 'react-router-dom';

const NativeNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    & ul {
        display: flex;
        justify-content: space-evenly;
        width: 80%;
    }
    & > ul {
        padding: 4px 16px;
    }
    & li {
        display: flex;
        cursor: pointer;
        text-transform: uppercase;
        color: black;
        padding: 6px 8px;
    }
    & img {
        height: 100px;
    }
    & .navigation-wrapper {
        flex-basis: 90%;
    }
    & a {
        color: black;
        text-decoration: none;
        font-weight: 900;
        font-size: 12px;
    }
`;

const Nav = () => (
    <div>
        <NativeNav>
            <img src={logo} alt={'Yankeemall Logo'} />
            <div className={'navigation-wrapper'}>
                <TopBar />
                <ul>
                    <li>
                        <RouterLink to="/">Home</RouterLink>
                    </li>
                    <li>
                        <Link to="stores" spy={true} smooth={true} duration={500}>
                            Stores
                        </Link>
                    </li>
                    <li>
                        <Link to="contact-us" spy={true} smooth={true} duration={500}>
                            Contact Us
                        </Link>
                    </li>
                </ul>
            </div>
        </NativeNav>
    </div>
);

export default Nav;
