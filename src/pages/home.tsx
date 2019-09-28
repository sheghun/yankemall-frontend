import React from 'react';
import Nav from '../components/nav';
import Wrapper from '../components/wrapper';
import Input from '../components/input';
import {Link} from 'react-router-dom';
import Button from '../components/button';
import heroImage from '../assets/images/carousel@2x.png';
import Select from '../components/select';
import supportedSites from '../_data/supportedSites';

const Home = () => (
    <>
        <Wrapper>
            <Nav />
            <div className={'hero'}>
                <img width={'100%'} src={heroImage} alt={'yankeemall-hero'} />
                <div className={'inputs-rectangle'}>
                    <h1>Select a Logo To Start Shopping. Click Our Button To CheckOut.</h1>
                    <div className={'inputs'}>
                        <Input width={14} placeholder={'Search for site'} />
                        <Select
                            width={12}
                            options={
                                <>
                                    <option disabled selected>
                                        All Categories
                                    </option>
                                </>
                            }
                        />
                        <Select
                            width={12}
                            options={
                                <>
                                    <option disabled selected>
                                        All Stores
                                    </option>
                                </>
                            }
                        />
                        <Select
                            width={12}
                            options={
                                <>
                                    <option disabled selected>
                                        Locations
                                    </option>
                                </>
                            }
                        />
                    </div>
                    <div className={'supported-sites-logo'}>
                        <div>
                            {supportedSites.map((s, i) => (
                                <Link key={i} to={s.href} target={'_blank'}>
                                    <img alt={s.alt} src={s.logo} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={'all-stores-button'}>
                <Button>View All Stores</Button>
            </div>
            <div className={'recently-sold-items'}>
                <h2>Recently Sold Items</h2>
            </div>
        </Wrapper>
        <style jsx>{`
            .hero {
                margin-top: 2rem;
                width: '100%';
            }
            .inputs-rectangle {
                background-color: #ff4252;
                margin-top: -2rem;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .inputs-rectangle > h1 {
                text-align: center;
                color: white;
                font-weight: 50;
                font-family: 'Quicksand';
            }
            .inputs-rectangle > img {
                width: 80%;
                margin: 1rem auto 1rem;
            }
            .inputs {
                display: flex;
                width: 100%;
                margin-bottom: 2rem;
                margin-top: 2rem;
                justify-content: space-evenly;
            }
            .supported-sites-logo {
                margin-bottom: 2rem;
            }
            .supported-sites-logo > div {
                display: flex;
                align-items: baseline;
                flex-wrap: wrap;
                justify-content: center;
            }
            .supported-sites-logo img {
                width: 200px;
            }
            .all-stores-button {
                width: 100%;
                margin-top: 2rem;
                display: flex;
                justify-content: center;
            }
        `}</style>
    </>
);

export default Home;
