import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const SignIn = () => {
    signInWithPopup(auth, provider)
    .catch(err => {return})
}