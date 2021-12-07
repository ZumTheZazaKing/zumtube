import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebase';
import { onSnapshot, collection, orderBy, query } from '@firebase/firestore';
import '../styles/Home.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Home = () => {

    const [videos, setVideos] = useState(null);

    useEffect(() => {
        const q = query(collection(db,"videos"), orderBy("createdAt","desc"));
        onSnapshot(q, collectionSnapshot => {
            if(collectionSnapshot.size > 0){
                setVideos([...collectionSnapshot.docs])
            }
        })
    },[])

    return (<div id="home">
        <h2>Recent Uploads</h2>
        <br/>
        <div id="videos">
            <Suspense fallback={<h1>Loading...</h1>}>
                {videos ? videos && videos.map((video, i) => 
                    <Video info={video} key={i}/>
                ) : <h2>No videos available</h2>}
            </Suspense>
        </div>
    </div>)
}