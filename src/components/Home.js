import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebase';
import { collection, orderBy, query, limit, startAfter, getDocs } from '@firebase/firestore';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import '../styles/Home.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Home = () => {

    const [recents, setRecents] = useState(null);
    const [recommended, setRecommended] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [showMoreRecents, setShowMoreRecents] = useState(true);
    const [showMoreRecommeded, setShowMoreRecommended] = useState(true);

    useEffect(() => {
        getRecents();
        getRecommended();
    },[])

    const getRecents = async () => {
        const firstBatch = query(collection(db,"videos"), orderBy("createdAt","desc"), limit(6));
        await getDocs(firstBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                setRecents([...snapshot.docs])
            }
        })
    }
    const getRecommended = async () => {
        const firstBatch = query(collection(db,"videos"), orderBy("viewers","desc"), limit(6));
        await getDocs(firstBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                setRecommended([...snapshot.docs])
            }
        })
    }
    const handleViewMoreRecommended = async() => {
        const nextBatch = query(collection(db,"videos"), orderBy("viewers","desc"),startAfter(recommended[recommended.length-1].data().viewers),limit(6));
        await getDocs(nextBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                setRecommended([...recommended, ...snapshot.docs])
            } else {
                setShowMoreRecommended(false);
            }
        })
    }

    const goToSearch = (e) => {
        e.preventDefault();
        if(!searchQuery)return toast.warning("Search something!");
        navigate(`/search/${searchQuery}`);
    }

    const handleViewMoreRecents = async() => {
        const nextBatch = query(collection(db,"videos"), orderBy("createdAt","desc"),startAfter(recents[recents.length-1].data().createdAt),limit(6));
        await getDocs(nextBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                setRecents([...recents, ...snapshot.docs])
            } else {
                setShowMoreRecents(false);
            }
        })
    }

    return (<div id="home">
        <br/>
        <form id="search" onSubmit={e => goToSearch(e)}>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
            <Button id="searchButton" onClick={(e) => goToSearch(e)} variant="contained"><SearchIcon fontSize="small"/></Button>
        </form>
        <br/>
        <h2>Recommended</h2>
        <br/>
        <div id="videos">
            <Suspense fallback={<div><CircularProgress disableShrink/></div>}>
                {recommended ? recommended && recommended.map((video, i) => 
                    <Video info={video} key={i}/>
                ) : <h2>No videos available</h2>}
            </Suspense>
        </div>
        <br/>
        {recents ? <div id="viewMore">
            {showMoreRecommeded ? 
            <Button onClick={() => handleViewMoreRecommended()} className="button">View More</Button>
            : <h4>That's all for now</h4>}
        </div> : ""}

        <br/>
        <h2>Recent Uploads</h2>
        <br/>
        <div id="videos">
            <Suspense fallback={<div><CircularProgress disableShrink/></div>}>
                {recents ? recents && recents.map((video, i) => 
                    <Video info={video} key={i}/>
                ) : <h2>No videos available</h2>}
            </Suspense>
        </div>
        <br/>
        {recents ? <div id="viewMore">
            {showMoreRecents ? 
            <Button onClick={() => handleViewMoreRecents()} className="button">View More</Button>
            : <h4>That's all for now</h4>}
        </div> : ""}
        
    </div>)
}