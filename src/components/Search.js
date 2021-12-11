import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebase';
import { onSnapshot, collection, orderBy, query, limit, startAfter } from '@firebase/firestore';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import '../styles/Search.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Search = () => {

    const [searchVideos, setSearchVideos] = useState(null);
    const { searchQuery } = useParams();
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const firstBatch = query(collection(db,'videos'), orderBy("createdAt","desc"),limit(10));
        onSnapshot(firstBatch, snapshot => {
            if(snapshot.size > 0){
                setSearchVideos(snapshot.docs.filter(doc => 
                    doc.data().title.toLowerCase().includes(searchQuery.toLowerCase()))
                )
            }
        })
    },[searchQuery])

    const handleViewMore = () => {
        const nextBatch = query(collection(db,"videos"), orderBy("createdAt","desc"),startAfter(searchVideos[searchVideos.length-1].data().createdAt),limit(10));
        onSnapshot(nextBatch, collectionSnapshot => {
            if(collectionSnapshot.size > 0){
                setSearchVideos([...searchVideos, ...collectionSnapshot.docs.filter(doc => 
                    doc.data().title.toLowerCase().includes(searchQuery.toLowerCase())
                )]);
                if(collectionSnapshot.docs.filter(doc => 
                    doc.data().title.toLowerCase().includes(searchQuery.toLowerCase()))){
                        setShowMore(false)
                }
            }
        })
    }

    return (<div id="searchPage">
        <h3>{searchVideos ? (searchVideos.length ? `Results for '${searchQuery}'` : `No results for '${searchQuery}'`) : ""}</h3>
        <br/>
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