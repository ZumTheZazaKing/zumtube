import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebase';
import { onSnapshot, collection, orderBy, query } from '@firebase/firestore';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles/Search.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Search = () => {

    const [searchVideos, setSearchVideos] = useState(null);
    const { searchQuery } = useParams();

    useEffect(() => {
        const q = query(collection(db,'videos'), orderBy("createdAt","desc"));
        onSnapshot(q, snapshot => {
            if(snapshot.size > 0){
                setSearchVideos([...snapshot.docs.filter(doc => 
                    doc.data().title.toLowerCase().includes(searchQuery.toLowerCase()))
                ])
            }
        })
    },[searchQuery])

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
    </div>)
}