import React from 'react';
import facebookImage from '../assets/images/facebook-logo.svg';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

const Wrapper = styled.div`
    background-color: white;
    .pre-footer {
        margin-top: 5rem;
        width: 100%;
        color: rgba(0, 0, 0, 0.6);
        line-height: 2;
        font-size: 14px;
        text-transform: capitalize;
        align-items: start;
        justify-content: center;
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
                <Grid container justify={'center'} spacing={3}>
                    <Grid item xs={10} sm={4} md={3}>
                        <div className={'pre-footer-blocks follow-us'}>
                            <h3>Follow Us</h3>
                            <p>
                                Join us and keep up to date with us on any of these social media
                                platforms
                                <div>
                                    <img
                                        alt={'twitter link'}
                                        src="https://img.icons8.com/color/48/000000/twitter.png"
                                    />
                                    <img alt={'facebook link'} src={facebookImage} />
                                </div>
                            </p>
                        </div>
                    </Grid>
                    <Grid item xs={10} sm={4} md={3}>
                        <div className={'pre-footer-blocks, contact-us'}>
                            <h3>Contact Us</h3>
                            <p>
                                Call Us Now: +234-812-332-2389
                                <br />
                                Email:{' '}
                                <span style={{textTransform: 'lowercase'}}>info@eromalls.com</span>
                            </p>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <hr style={{borderColor: 'rgba(0, 0, 0, 0.05)'}} />
        </Wrapper>
    );
};

export default Footer;
