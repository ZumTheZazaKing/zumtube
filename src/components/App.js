import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Context } from '../context/Context';
import { lazy, Suspense, useEffect } from 'react'; 
import { HashRouter, Routes, Route } from 'react-router-dom';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import BackToTop from 'react-back-to-top-button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import 'react-toastify/dist/ReactToastify.css';

const Topbar = lazy(() => import('./Topbar').then(module => ({default:module.Topbar})));
const Home = lazy(() => import('./Home').then(module => ({default:module.Home})));
const Create = lazy(() => import('./Create').then(module => ({default:module.Create})));
const Channel = lazy(() => import('./Channel').then(module => ({default:module.Channel})));
const Edit = lazy(() => import('./Edit').then(module => ({default:module.Edit})));
const Watch = lazy(() => import('./Watch').then(module => ({default:module.Watch})));
const Search = lazy(() => import('./Search').then(module => ({default:module.Search})));
const EditChannel = lazy(() => import('./EditChannel').then(module => ({default:module.EditChannel})));

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
        <Suspense fallback={<div className="loading">
          <CircularProgress size={60} thickness={4} disableShrink/>
          </div>}>

          <Context.Provider value={{
            user
          }}>
            <Topbar/>
            <Routes>
              
              <Route exact path="/" element={<Home/>}/>
              <Route exact path="/create" element={<Create/>}/>
              <Route path="/channel/:id" element={<Channel/>}/>
              <Route path="/edit/:id" element={<Edit/>}/>
              <Route path="/watch/:id" element={<Watch/>}/>
              <Route path="/search/:searchQuery" element={<Search/>}/>
              <Route path="/editchannel/:id" element={<EditChannel/>}/>

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
            <BackToTop
              showOnScrollUp
              showAt={100}
              speed={1500}
            >
              <KeyboardArrowUpIcon id="backToTop"/>
            </BackToTop>
          </Context.Provider>
        </Suspense>
      </div>
    </HashRouter>
  );
}

export default App;
