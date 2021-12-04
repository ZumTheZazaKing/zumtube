import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Context } from '../context/Context';
import { lazy, Suspense } from 'react'; 

const Topbar = lazy(() => import('./Topbar').then(module => ({default:module.Topbar})));

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Suspense fallback={<h1>Loading...</h1>}>
        <Context.Provider value={{
          user
        }}>
          <Topbar/>
        </Context.Provider>
      </Suspense>
    </div>
  );
}

export default App;
