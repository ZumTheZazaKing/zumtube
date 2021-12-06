import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import { useContext } from 'react';
import { Context } from '../context/Context';
import { auth } from '../firebase'
import '../styles/Topbar.css';
import Logo from '../images/logodarkcut.png'

export function Topbar(){
    const { user } = useContext(Context);

    return (<div id="topbar">
        <img id="logo" src={Logo} alt="logo"/>
        <div id="ppStuff">
            {user ? <SignOut/> : <SignIn/>}
            <img id="pp" src={user ? auth.currentUser.photoURL : "https://via.placeholder.com/100x100.jpg?text=G"} alt="pp"/>
        </div>
    </div>)
}