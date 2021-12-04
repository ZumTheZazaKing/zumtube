import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const SignIn = () => {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .catch(err => {return})
    }   
    return (<button onClick={() => signInWithGoogle()}>Sign In</button>)
}