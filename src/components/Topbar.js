import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon  from '@mui/material/ListItemIcon';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import '../styles/Topbar.css';
import Logo from '../images/logodarkcut.png'

export function Topbar(){
    const { user } = useContext(Context);

    let navigate = useNavigate();

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
        <img id="logo" src={Logo} alt="logo" onClick={() => navigate("/")}/>
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
                <MenuItem onClick={() => {guestHandleClose(); SignIn()}}>
                    <ListItemIcon><LoginIcon fontSize="small"/></ListItemIcon>
                    Sign In
                </MenuItem>
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
                <MenuItem onClick={() => {profileHandleClose(); navigate(`/channel/${auth.currentUser.uid}`)}}>
                    <ListItemIcon>
                        <AccountBoxIcon fontSize="small"/>
                    </ListItemIcon>
                    Your Channel
                </MenuItem>
                <MenuItem onClick={() => {profileHandleClose(); navigate("/create")}}>
                    <ListItemIcon>
                        <AddIcon fontSize="small"/>
                    </ListItemIcon>
                    Create Video
                </MenuItem>
                <MenuItem onClick={() => {profileHandleClose(); SignOut()}}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small"/>
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            </Menu>
        </div>
    </div>)
}