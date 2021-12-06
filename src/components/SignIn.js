import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import Button from '@mui/material/Button';

export const SignIn = () => {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .catch(err => {return})
    }   
    return (<Button variant="outlined" onClick={() => signInWithGoogle()}>Sign In</Button>)
}