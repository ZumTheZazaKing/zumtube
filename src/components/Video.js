import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from "../firebase";
import { onSnapshot, doc } from "@firebase/firestore";
import { Context } from '../context/Context';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress';

export const Video = (props) => {

    const { title, thumbnail, author, viewers } = props.info.data();
    const { user } = useContext(Context);
    const [authorDetails, setAuthorDetails] = useState({name:"",photo:""});
    const navigate = useNavigate();

    useEffect(() => {
        onSnapshot(doc(db,"users",author), snapshot => {
            setAuthorDetails({name:snapshot.data().name, photo:snapshot.data().avatar})
        })
    },[author])

    const watchVideo = () => {
        navigate(`/watch/${props.info.id}`)
    }

    return (<div className="video"
    id={props.info.id}
    onClick={watchVideo}
    onContextMenu={user ? (auth.currentUser.uid === author ? props.onContextMenu : () => {return}) : () => {return}}>
        <LazyLoadImage
            id="videoThumbnail" alt="" 
            src={thumbnail || "https://via.placeholder.com/150?text=U"}
            placeholder={<CircularProgress disableShrink/>}
        />
        <div id="videoDetails">
            <Avatar id="videoAuthorImg" src={authorDetails.photo} alt="Z"/>
            <div id="videoWords">
                <p id="videoTitle">{title.length > 42 ? `${title.substr(0,42)}...` : title}</p>
                <p id="videoAuthor">
                    {authorDetails.name.length > 25 ? `${authorDetails.name.substr(0,25)}...` : authorDetails.name}
                    <br/>
                    {viewers.length} views
                </p>
            </div>
        </div>
    </div>)
}