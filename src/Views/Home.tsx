import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import Nav from '../components/nav';
import Wrapper from '../components/wrapper';
import Input from '../components/input';
import Button from '@material-ui/core/Button';
import heroImage from '../assets/images/eromalls-banner.jpg';
import Select from '../components/select';
import Axios from 'axios';
import styled from 'styled-components';
import Footer from '../components/Footer';
import Grid from '@material-ui/core/Grid';
import TransitionsModal from '../components/Modal';

const Style = styled.div`
    margin-top: 2rem;
    width: '100%';
    & img {
        transition: all .5s ease-in-out;
    }
    & .hero {
        background-image: url('${heroImage}');
        background-position: top;
        min-height: 450px;
        background-size: cover;
        background-attachment: fixed;
    }
    & .download-our-extension-div {
        background-attachment: fixed;
        background-color: #D10065;
        padding-top: 5rem;
        padding-bottom: 2rem;
    }
    & .download-our-extension-div > h1 {
        text-align: center;
        color: white;
        font-weight: 50;
        font-family: 'Quicksand';
    }
    & .inputs-rectangle {
        background-color: #fff;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    & .inputs-rectangle > h1 {
        text-align: center;
        color: #FCBF00;
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
    const imgRef = useRef((<div /> as any) as HTMLImageElement);

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
                <TransitionsModal />
                <Nav />
                <Style>
                    <div>
                        <img
                            ref={ref => (imgRef.current = ref as HTMLImageElement)}
                            width={'100%'}
                            src={heroImage}
                            alt={'eromall-hero'}
                        />
                        <div className={'download-our-extension-div'}>
                            <h1>Download Our Chrome Extension</h1>
                            <a
                                target={'_blank'}
                                href={
                                    'https://chrome.google.com/webstore/detail/eromalls/nikondefdlgokmjgmigjjpppfmpalick'
                                }
                            >
                                <Button
                                    style={{
                                        textAlign: 'center',
                                        left: '50%',
                                        marginTop: '3rem',
                                        position: 'relative',
                                        transform: 'translateX(-50%)',
                                    }}
                                    color={'secondary'}
                                    variant={'contained'}
                                    size={'large'}
                                >
                                    Download
                                </Button>
                            </a>
                        </div>
                        <div id={'stores'} className={'inputs-rectangle'}>
                            <h1>Select a Logo To Start Shopping. Click Our Button To CheckOut.</h1>
                            <div className={'inputs'}>
                                <Grid container justify={'center'} spacing={3}>
                                    <Grid item xs={10} sm={6} md={3}>
                                        <Input
                                            width={'100%'}
                                            onChange={filterSites('search')}
                                            name={'search'}
                                            placeholder={'Search for site'}
                                        />
                                    </Grid>
                                    <Grid item xs={10} sm={6} md={3}>
                                        <Select
                                            width={'100%'}
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
                                    </Grid>
                                    <Grid item xs={10} sm={6} md={3}>
                                        <Select
                                            width={'100%'}
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
                                    </Grid>
                                    <Grid item xs={10} sm={6} md={3}>
                                        <Select
                                            width={'100%'}
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
                                    </Grid>
                                </Grid>
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
                    <Footer />
                </Style>
            </Wrapper>
        </>
    );
};

export default Home;
