import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Context } from '../context/Context';
import { lazy, Suspense } from 'react'; 
import { HashRouter, Routes, Route } from 'react-router-dom';

const Topbar = lazy(() => import('./Topbar').then(module => ({default:module.Topbar})));
const Home = lazy(() => import('./Home').then(module => ({default:module.Home})));
const Create = lazy(() => import('./Create').then(module => ({default:module.Create})));

function App() {

  const [user] = useAuthState(auth);

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
          </Context.Provider>
        </Suspense>
      </div>
    </HashRouter>
  );
}

export default App;
