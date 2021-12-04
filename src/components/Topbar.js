import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import { useContext } from 'react';
import { Context } from '../context/Context';

export function Topbar(){
    const { user } = useContext(Context);

    return (<div>
        <h1>ZumTube</h1>
        {user ? <SignOut/> : <SignIn/>}
    </div>)
}