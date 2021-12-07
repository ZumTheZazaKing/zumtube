import { useEffect, useState } from 'react';
import { db } from "../firebase";
import { onSnapshot, doc } from "@firebase/firestore";

export const Video = (props) => {

    const { title, thumbnail, author } = props.info.data();

    const [authorDetails, setAuthorDetails] = useState({name:"",photo:""});

    useEffect(() => {
        onSnapshot(doc(db,"users",author), snapshot => {
            setAuthorDetails({name:snapshot.data().name, photo:snapshot.data().avatar})
        })
    },[author])

    return (<div className="video">
        <img id="videoThumbnail" alt="" src={thumbnail} width="100" height="100"/>
        <div id="videoDetails">
            <img id="videoAuthorImg" src={authorDetails.photo} alt=""/>
            <div id="videoWords">
                <p id="videoTitle">{title.length > 42 ? `${title.substr(0,42)}...` : title}</p>
                <p id="videoAuthor">{authorDetails.name}</p>
            </div>
        </div>
    </div>)
}