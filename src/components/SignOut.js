import { auth } from "../firebase";

export const SignOut = () => {
    auth.signOut()
}