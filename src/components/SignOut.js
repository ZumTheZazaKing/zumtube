import { auth } from "../firebase";
import Button from '@mui/material/Button';

export const SignOut = () => {
    return auth.currentUser && (
        <Button variant="outlined" onClick={() => auth.signOut()}>Sign Out</Button>
    )
}