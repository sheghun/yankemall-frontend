import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from 'react-router-dom';
import PersonIcon from '@material-ui/icons/PersonOutline';
import OrderIcon from '@material-ui/icons/AllInbox';
import Axios from 'axios';

/**
 * The top bar component that comes before the nav bar
 * @constructor
 */

const NativeNav = styled.nav`
    border-bottom: solid 1px rgba(0, 0, 0, 0.09);
    background-color: white;
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
    & .my-profile {
        position: relative;
    }
    & .my-profile-dropdown {
        position: absolute;
        position: absolute;
        top: 2.5rem;
        padding: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
        width: 180px;
        text-align: center;
    }
    & .my-profile-dropdown:after {
        content: ' ';
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -15px;
        margin-top: -1.8rem;
        filter: drop-shadow(0 -2px 1px rgba(0, 0, 0, 0.07));
        border-width: 15px;
        border-style: solid;
        border-color: transparent transparent white;
    }
`;
const TopBar = () => {
    const [showDropDown, setShowDropDown] = useState(false);

    const [user, setUser] = useState({} as User);

    // Try getting user details and see if user is logged in
    useEffect(() => {
        (async () => {
            try {
                const {status, data} = await Axios.get('/user');
                if (status === 200 && data.status === 'success') {
                    if (data.data.data === null) {
                        return;
                    }
                    setUser(data.data.data);
                }
            } catch (e) {}
        })();
    }, []);

    useEffect(() => {
        const listener = () => {
            if (showDropDown) {
                setShowDropDown(false);
            }
        };
        document.addEventListener('click', listener);

        return () => {
            document.removeEventListener('click', listener);
        };
    }, [showDropDown]);

    return (
        <NativeNav>
            <ul>
                <li className={'faint'}>
                    EN <div className={'caret'} />
                </li>
                <li className={'faint'}>
                    USD <div className={'caret'} />
                </li>
                <li className={'my-profile'} onClick={_ => setShowDropDown(true)}>
                    <i className={'ion-ios-person-outline icons'} />
                    {user.firstName ? `Hi ${user.firstName}` : 'My Profile'}
                    {showDropDown && (
                        <Paper className={'my-profile-dropdown'}>
                            {!user.firstName && (
                                <>
                                    <Link to={'/auth/signin'}>
                                        <Button color={'primary'} fullWidth variant={'contained'}>
                                            Signin
                                        </Button>
                                    </Link>
                                    <Divider variant={'inset'} style={{margin: '2rem 0 1rem'}} />
                                    <Link to={'/auth/signup'}>
                                        <Button fullWidth color={'primary'}>
                                            Create An Account
                                        </Button>
                                    </Link>
                                    <Divider style={{margin: '1rem 0'}} />
                                </>
                            )}
                            <List component="nav" aria-label="main mailbox folders">
                                <Link to={'/dashboard/overview'}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            style={{
                                                fontSize: 14,
                                                textTransform: 'capitalize',
                                                fontWeight: 600,
                                            }}
                                            primary={'Account'}
                                        />
                                    </ListItem>
                                </Link>
                                <Link to={'/dashboard/orders'}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <OrderIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            style={{
                                                fontSize: 14,
                                                textTransform: 'capitalize',
                                                fontWeight: 600,
                                            }}
                                            primary={'Orders'}
                                        />
                                    </ListItem>
                                </Link>
                            </List>
                        </Paper>
                    )}
                </li>
            </ul>
        </NativeNav>
    );
};

export default TopBar;
