import { useParams } from "react-router-dom";
import { db } from '../firebase';
import { onSnapshot, doc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import '../styles/Watch.css';

export const Watch = () => {

    const { id } = useParams();
    const [videoDetails, setVideoDetails] = useState({
        title:"",
        description:"",
        video:"",
        date:""
    })

    useEffect(() => {
        
        onSnapshot(doc(db,"videos",id), snapshot => {
            setVideoDetails({
                title:snapshot.data().title,
                description:snapshot.data().description,
                video:snapshot.data().video,
                date:snapshot.data().date
            })
        })

    },[id])

    return (<div id="watch">
        <video src={videoDetails.video} width="300" height="200" autoPlay controls/>
        <p id="watchTitle">{videoDetails.title}</p>
        <p>{videoDetails.date}</p>
        <details id="watchDescription">
            <summary>Description</summary>
            <textarea value={videoDetails.description} readOnly></textarea>
        </details>
    </div>)
}