import React from 'react';
import facebookImage from '../assets/images/facebook-logo.svg';
import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: white;
    .pre-footer {
        margin-top: 5rem;
        display: flex;
        color: rgba(0, 0, 0, 0.6);
        line-height: 2;
        font-size: 14px;
        text-transform: capitalize;
        align-items: start;
        justify-content: center;
    }
    & .pre-footer-blocks {
        flex-basis: 300px;
    }
    & .pre-footer .follow-us {
        margin-right: 100px;
    }
    & .pre-footer .follow-us {
    }
    & .pre-footer .follow-us img {
        margin-top: 1rem;
        height: 24px;
    }
    & .pre-footer .follow-us img:first-child {
        margin-right: 50px;
    }
    & .footer {
        padding: 2rem;
        color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: space-around;
    }
    & .footer-blocks-links-wrapper {
        display: flex;
        flex-direction: column;
    }
    & .footer-blocks-links-wrapper a {
        font-size: 14px;
        margin-bottom: 1rem;
    }
`;
const Footer = () => {
    return (
        <Wrapper>
            <div id={'contact-us'} className={'pre-footer'}>
                <div className={'pre-footer-blocks follow-us'}>
                    <h3>Follow Us</h3>
                    <p>
                        Join us and keep up to date with us on any of these social media platforms
                        <div>
                            <img
                                alt={'twitter link'}
                                src="https://img.icons8.com/color/48/000000/twitter.png"
                            />
                            <img alt={'facebook link'} src={facebookImage} />
                        </div>
                    </p>
                </div>
                <div className={'pre-footer-blocks, contact-us'}>
                    <h3>Contact Us</h3>
                    <p>
                        Call Us Now: +234-812-332-2389
                        <br />
                        Email: <span style={{textTransform: 'lowercase'}}>info@eromalls.com</span>
                    </p>
                </div>
            </div>
            <hr style={{borderColor: 'rgba(0, 0, 0, 0.05)'}} />
            {/*<div className={'footer'}>
                <div className={'footer-blocks'}>
                    <h3>Information</h3>
                    <div className={'footer-blocks-links-wrapper'}>
                        <a>About Us</a>
                        <a>Privacy Policy</a>
                        <a>Term &amp; Conditions</a>
                    </div>
                </div>
                <div className={'footer-blocks'}>
                    <h3>Information</h3>
                    <div className={'footer-blocks-links-wrapper'}>
                        <a>About Us</a>
                        <a>Privacy Policy</a>
                        <a>Term &amp; Conditions</a>
                    </div>
                </div>
            </div>*/}
        </Wrapper>
    );
};

export default Footer;
