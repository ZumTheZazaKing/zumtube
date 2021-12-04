import { auth } from "../firebase"

export const SignOut = () => {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}