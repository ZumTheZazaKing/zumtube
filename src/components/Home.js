import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebase';
import { collection, orderBy, query, limit, startAfter, getDocs } from '@firebase/firestore';
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
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        getVideos();
    },[])

    const getVideos = async () => {
        const firstBatch = query(collection(db,"videos"), orderBy("createdAt","desc"), limit(10));
        await getDocs(firstBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                setVideos([...snapshot.docs])
            }
        })
    }

    const goToSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${searchQuery}`);
    }

    const handleViewMore = async() => {
        const nextBatch = query(collection(db,"videos"), orderBy("createdAt","desc"),startAfter(videos[videos.length-1].data().createdAt),limit(10));
        await getDocs(nextBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                setVideos([...videos, ...snapshot.docs])
            } else {
                setShowMore(false);
            }
        })
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
        <br/>
        {videos ? <div id="viewMore">
            {showMore ? 
            <Button onClick={handleViewMore} className="button">View More</Button>
            : <h4>That's all for now</h4>}
        </div> : ""}
        
    </div>)
}