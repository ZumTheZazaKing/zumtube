import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebase';
import { onSnapshot, collection, orderBy, query } from '@firebase/firestore';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import '../styles/Home.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Home = () => {

    const [videos, setVideos] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db,"videos"), orderBy("createdAt","desc"));
        onSnapshot(q, collectionSnapshot => {
            if(collectionSnapshot.size > 0){
                setVideos([...collectionSnapshot.docs])
            }
        })
    },[])

    const goToSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${searchQuery}`);
    }

    return (<div id="home">
        <br/>
        <form id="search" onSubmit={e => goToSearch(e)}>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
            <Button id="searchButton" variant="contained"><SearchIcon fontSize="small"/></Button>
        </form>
        <br/>
        <h2>Recent Uploads</h2>
        <br/>
        <div id="videos">
            <Suspense fallback={<div><CircularProgress disableShrink/></div>}>
                {videos ? videos && videos.map((video, i) => 
                    <Video info={video} key={i}/>
                ) : <h2>No videos available</h2>}
            </Suspense>
        </div>
    </div>)
}