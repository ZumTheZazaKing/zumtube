import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebase';
import { collection, orderBy, query, limit, startAfter, getDocs } from '@firebase/firestore';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import '../styles/Search.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Search = () => {

    const [searchVideos, setSearchVideos] = useState(null);
    const [searchChannels, setSearchChannels] = useState(null);
    const { searchQuery } = useParams();
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        getSearchVideos();
        getSearchChannels();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const getSearchVideos = async () => {
        const firstBatch = query(collection(db,'videos'), orderBy("viewers","desc"),limit(10));
        await getDocs(firstBatch)
        .then(snapshot => {
            setSearchVideos(snapshot.docs.filter(doc => 
                doc.data().title.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        })
    }
    const getSearchChannels = async () => {
        const firstBatch = query(collection(db,'users'), orderBy("name","asc"),limit(6));
        await getDocs(firstBatch)
        .then(snapshot => {
            setSearchChannels(snapshot.docs.filter(doc => 
                doc.data().name.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        })
    }

    const handleViewMore = async () => {
        const nextBatch = query(collection(db,"videos"), orderBy("viewers","desc"),startAfter(searchVideos[searchVideos.length-1].data().createdAt),limit(10));
        
        await getDocs(nextBatch)
        .then(snapshot => {
            setSearchVideos([...searchVideos, ...snapshot.docs.filter(doc => 
                doc.data().title.toLowerCase().includes(searchQuery.toLowerCase())
            )]);
            if(snapshot.docs.filter(doc => doc.data().title.toLowerCase().includes(searchQuery.toLowerCase()))){
                setShowMore(false)
            }
        })
    }

    return (<div id="searchPage">
        <h3>{searchVideos ? (searchVideos.length ? `Results for '${searchQuery}'` : (searchChannels ? (searchChannels.length ? `Results for '${searchQuery}'` : `No results for '${searchQuery}'`) : "")) : ""}</h3>
        <br/>
        <div id="channels">
            <Suspense fallback={<div><CircularProgress disableShrink/></div>}>
                {searchChannels ? searchChannels && searchChannels.map((channel, i) => 
                    <div className="channel" key={i}>
                        <Avatar id="channelAvatar" src={channel.data().avatar} alt={channel.data().name}/>
                        <p>{channel.data().name}</p>
                    </div>
                ) : ""}
            </Suspense>
        </div>
        <div id="videos">
            <Suspense fallback={<div><CircularProgress disableShrink/></div>}>
                {searchVideos ? searchVideos && searchVideos.map((video, i) => 
                    <Video info={video} key={i}/>
                ) : <h2>Searching...</h2>}
            </Suspense>
        </div>
        <br/>
        {searchVideos ? ( searchVideos.length ?
        <div id="viewMore">
            {showMore ? 
            <Button onClick={handleViewMore} className="button">View More</Button>
            : <h4>That's all for now</h4>}
        </div> : "") : ""}
    </div>)
}