import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import Nav from '../components/nav';
import Wrapper from '../components/wrapper';
import Input from '../components/input';
import Button from '../components/button';
import heroImage from '../assets/images/carousel@2x.png';
import Select from '../components/select';
import featuredProductsImage from '../assets/images/featured-product.png';
import Axios from 'axios';

import whyUsImage from '../assets/images/why-us.png';
import styled from 'styled-components';

const Style = styled.div`
    margin-top: 2rem;
    width: '100%';
    & .inputs-rectangle {
        background-color: #ff4252;
        margin-top: -2rem;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    & .inputs-rectangle > h1 {
        text-align: center;
        color: white;
        font-weight: 50;
        font-family: 'Quicksand';
    }
    & .inputs-rectangle > img {
        width: 80%;
        margin: 1rem auto 1rem;
    }
    & .inputs {
        display: flex;
        width: 100%;
        margin-bottom: 2rem;
        margin-top: 2rem;
        justify-content: space-evenly;
    }
    & .supported-sites-logo {
        margin-bottom: 2rem;
    }
    & .supported-sites-logo > div {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        justify-content: center;
    }
    & .supported-sites-logo img {
        width: 200px;
    }
    & .all-stores-button {
        width: 100%;
        margin-top: 2rem;
        display: flex;
        justify-content: center;
    }
    & .recently-sold-items-wrapper {
        margin-top: 4rem;
        margin-bottom: 4rem;
        display: flex;
        justify-content: center;
        text-align: center;
        text-transform: uppercase;
        font-family: 'Quicksand';
    }
    & .recently-sold-items img {
        max-width: 90%;
        margin-left: -2rem;
    }
    & .shipping-infos {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    & .shipping-infos img {
        width: 80%;
    }
`;
const Home = () => {
    const [sites, setSites] = useState([] as Array<Site>);
    const [filteredSites, setFilteredSites] = useState([] as Array<Site>);
    const [categories, setCategories] = useState([] as Array<Category>);
    const [locations, setLocations] = useState([] as Array<Location>);
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        // Retrieve the list of sites, categories and locations
        (async () => {
            try {
                const {status, data} = await Axios.get('/base/sites');
                if (status === 200 && data.status === 'success') {
                    setSites(data.data);
                }
            } catch (e) {}
        })();
        (async () => {
            try {
                const {status, data} = await Axios.get('/base/categories');
                if (status === 200 && data.status === 'success') {
                    setCategories(data.data);
                }
            } catch (e) {}
        })();
        (async () => {
            try {
                const {status, data} = await Axios.get('/base/locations');
                if (status === 200 && data.status === 'success') {
                    setLocations(data.data);
                }
            } catch (e) {}
        })();
    }, []);

    useEffect(() => {
        setFilteredSites(sites);
    }, [sites]);

    const categoriesElement = useMemo(
        () =>
            categories.map((c, i) => (
                <option key={i} value={c.id}>
                    {c.title}
                </option>
            )),
        [categories],
    );

    const locationsElement = useMemo(
        () =>
            locations.map((l, i) => (
                <option key={i} value={l.id}>
                    {l.country}
                </option>
            )),
        [locations],
    );

    const filterSites = (type: string) => (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    ) => {
        const filterSearch = (sites: Array<Site>, value: string) => {
            if (value === '') return sites;
            return sites.flatMap(s => {
                switch (true) {
                    case s.host.includes(value):
                        return s;
                    case !!s.domains.find(d => d.includes(value)):
                        return s;
                    case !!s.cartUrls.find(c => c.includes(value)):
                        return s;
                    default:
                        return [];
                }
            });
        };

        const filterCategory = (sites: Array<Site>, value: string) => {
            if (value === '') return sites;
            return sites.flatMap(s => {
                switch (true) {
                    case Number(s.categoryId) === 0:
                        return s;
                    case Number(s.categoryId) === Number(value):
                        return s;
                    default:
                        return [];
                }
            });
        };

        const filterLocation = (sites: Array<Site>, value: string) => {
            if (value === '') return sites;
            setLocationFilter(value);
            return sites.flatMap(s => {
                return Number(s.locationId) === Number(value) ? s : [];
            });
        };
        switch (type) {
            case 'search':
                setSearchFilter(event.target.value);
                {
                    let newSites = [...sites];
                    if (categoryFilter) newSites = filterCategory(newSites, categoryFilter);
                    if (locationFilter) newSites = filterLocation(newSites, locationFilter);
                    newSites = filterSearch(newSites, event.target.value);
                    setFilteredSites(newSites);
                }
                break;
            case 'categories':
                setCategoryFilter(event.target.value);
                {
                    let newSites = [...sites];
                    if (searchFilter) newSites = filterSearch(newSites, searchFilter);
                    if (locationFilter) newSites = filterLocation(newSites, locationFilter);
                    newSites = filterCategory(newSites, event.target.value);
                    setFilteredSites(newSites);
                }
                break;
            case 'locations':
                setLocationFilter(event.target.value);
                {
                    let newSites = [...sites];
                    if (searchFilter) newSites = filterSearch(newSites, searchFilter);
                    if (categoryFilter) newSites = filterCategory(newSites, categoryFilter);
                    newSites = filterLocation(newSites, event.target.value);
                    setFilteredSites(newSites);
                }
                break;
        }
    };

    return (
        <>
            <Wrapper>
                <Nav />
                <Style>
                    <div>
                        <img width={'100%'} src={heroImage} alt={'yankeemall-hero'} />
                        <div className={'inputs-rectangle'}>
                            <h1>Select a Logo To Start Shopping. Click Our Button To CheckOut.</h1>
                            <div className={'inputs'}>
                                <Input
                                    width={14}
                                    onChange={filterSites('search')}
                                    name={'search'}
                                    placeholder={'Search for site'}
                                />
                                <Select
                                    width={12}
                                    defaultValue={''}
                                    onChange={filterSites('categories')}
                                    name={'categories'}
                                    options={
                                        <>
                                            <option value={''}>All Categories</option>
                                            {categoriesElement}
                                        </>
                                    }
                                />
                                <Select
                                    width={12}
                                    name={'stores'}
                                    defaultValue={'0'}
                                    options={
                                        <>
                                            <option disabled value={'0'}>
                                                All Stores
                                            </option>
                                        </>
                                    }
                                />
                                <Select
                                    width={12}
                                    defaultValue={''}
                                    onChange={filterSites('locations')}
                                    name={'locations'}
                                    options={
                                        <>
                                            <option value={''}>All Locations</option>
                                            {locationsElement}
                                        </>
                                    }
                                />
                            </div>
                            <div className={'supported-sites-logo'}>
                                <div>
                                    {filteredSites.map((s, i) => (
                                        <a key={i} href={s.domains[0]} target={'_blank'}>
                                            <img alt={s.host} src={s.logo} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'all-stores-button'}>
                        <Button>View All Stores</Button>
                    </div>
                    <div className={'recently-sold-items-wrapper'}>
                        {/*<h3>Recently Sold Items</h3>*/}
                        <div className={'recently-sold-items'}>
                            <img src={featuredProductsImage} alt={'Featured products'} />
                            {/*<div className={'item'}></div>*/}
                            {/*<div className={'item'}></div>*/}
                            {/*<div className={'item'}></div>*/}
                        </div>
                    </div>
                    <div className={'shipping-infos'}>
                        <img src={whyUsImage} alt={'why us image'} />
                    </div>
                </Style>
            </Wrapper>
            <style jsx>{``}</style>
        </>
    );
};

export default Home;
