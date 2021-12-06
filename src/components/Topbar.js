import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { auth } from '../firebase'
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import '../styles/Topbar.css';
import Logo from '../images/logodarkcut.png'

export function Topbar(){
    const { user } = useContext(Context);

    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [guestAnchorEl, setGuestAnchorEl] = useState(null);
    const profileOpen = Boolean(profileAnchorEl);
    const guestOpen = Boolean(guestAnchorEl);
    const profileHandleClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };
    const profileHandleClose = () => {
        setProfileAnchorEl(null);
    };
    const guestHandleClick = (event) => {
        setGuestAnchorEl(event.currentTarget);
    };
    const guestHandleClose = () => {
        setGuestAnchorEl(null);
    };

    return (<div id="topbar">
        <img id="logo" src={Logo} alt="logo"/>
        <div id="ppStuff">
            {user ? <Avatar id="pp" alt="pp" src={auth.currentUser.photoURL} onClick={profileHandleClick}/> 
            : <Avatar id="pp" alt="pp" sx={{ bgcolor: "purple" }} onClick={guestHandleClick}>G</Avatar>}
            <Menu
                id="guest-menu"
                anchorEl={guestAnchorEl}
                open={guestOpen}
                onClose={guestHandleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {guestHandleClose(); SignIn()}}>Sign In</MenuItem>
            </Menu>
            <Menu
                id="profile-menu"
                anchorEl={profileAnchorEl}
                open={profileOpen}
                onClose={profileHandleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={profileHandleClose}>Profile</MenuItem>
                <MenuItem onClick={profileHandleClose}>My account</MenuItem>
                <MenuItem onClick={() => {profileHandleClose(); SignOut()}}>Sign Out</MenuItem>
            </Menu>
        </div>
    </div>)
}