import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, onSnapshot, orderBy, query } from '@firebase/firestore';
import '../styles/Channel.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Channel = () => {

    const { id } = useParams();
    const [channelInfo, setChannelInfo] = useState({
        name:"",
        description:"",
        videos:null,
        avatar:""
    })

    useEffect(() => {
        console.log(id);

        onSnapshot(doc(db,"users",id), snapshot => {
            const q = query(collection(db, "videos"), orderBy("createdAt","desc"));
            onSnapshot(q, collectionSnapshot => {
                setChannelInfo({
                    name:snapshot.data().name,
                    description:snapshot.data().description,
                    videos:[...collectionSnapshot.docs.filter(d => d.data().author === id)],
                    avatar:snapshot.data().avatar
                })
            })

        })

    },[id])

    return (channelInfo.name ? 
        <div id="channel">
            <img src={channelInfo.avatar} alt="" width="100" height="100"/>
            <h2>{channelInfo.name}</h2>
            <textarea value={channelInfo.description} readOnly></textarea>
            <div id="videos">
            <Suspense fallback={<h1>Loading...</h1>}>
                {channelInfo.videos ? channelInfo.videos && channelInfo.videos.map((video, i) => 
                    <Video info={video} key={i}/>
                ) : <h2>No videos available</h2>}
            </Suspense>
            </div>
        </div> 
    : <h1>Loading...</h1>)
}