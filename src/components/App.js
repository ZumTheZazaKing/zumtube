import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Context } from '../context/Context';
import { lazy, Suspense, useEffect } from 'react'; 
import { HashRouter, Routes, Route } from 'react-router-dom';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Topbar = lazy(() => import('./Topbar').then(module => ({default:module.Topbar})));
const Home = lazy(() => import('./Home').then(module => ({default:module.Home})));
const Create = lazy(() => import('./Create').then(module => ({default:module.Create})));

function App() {

  const [user] = useAuthState(auth);

  useEffect(
    () => {
      if(!user)return;

      onSnapshot(doc(db,"users",auth.currentUser.uid), snapshot => {
        if(!snapshot.exists()){
            handleNewUser();
        }
      })
    },[user]
  )

  const handleNewUser = async () => {
    const userDocRef = doc(db,"users",auth.currentUser.uid);
    const userPayload = {
      name:auth.currentUser.displayName,
      avatar:auth.currentUser.photoURL,
      description:"No description yet"
    }
    await setDoc(userDocRef, userPayload);
  }

  return (
    <HashRouter>
      <div className="App">
        <Suspense fallback={<h1>Loading...</h1>}>
          <Context.Provider value={{
            user
          }}>
            <Topbar/>
            <Routes>
              
              <Route exact path="/" element={<Home/>}/>
              <Route exact path="/create" element={<Create/>}/>

            </Routes>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </Context.Provider>
        </Suspense>
      </div>
    </HashRouter>
  );
}

export default App;
