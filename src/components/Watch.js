import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from '../firebase';
import { Context } from "../context/Context";
import { onSnapshot, doc, updateDoc } from "@firebase/firestore";
import { useEffect, useState, useContext } from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { toast } from 'react-toastify';
import '../styles/Watch.css';

export const Watch = () => {

    const { id } = useParams();
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [watchMonth, setWatchMonth] = useState(null)
    const [videoDetails, setVideoDetails] = useState({
        title:"",
        description:"",
        video:"",
        day:"",
        month:"",
        year:"",
        authorName:"",
        authorImg:"",
        authorId:"",
        views:0,
        likes:0,
        dislikes:0
    })

    useEffect(() => {

        viewCheck();
        
        onSnapshot(doc(db,"videos",id), snapshot => {
            const d = new Date(snapshot.data().createdAt.seconds*1000);
            switch(d.getMonth()){
                case "0":
                    setWatchMonth("Jan")
                    break;
                case "1":
                    setWatchMonth("Feb")
                    break;
                case "2":
                    setWatchMonth("Mar")
                    break;
                case "3":
                    setWatchMonth("Apr")
                    break;
                case "4":
                    setWatchMonth("May")
                    break;
                case "5":
                    setWatchMonth("Jun")
                    break;
                case "6":
                    setWatchMonth("July")
                    break;
                case "7":
                    setWatchMonth("Aug")
                    break;
                case "8":
                    setWatchMonth("Sep")
                    break;
                case "9":
                    setWatchMonth("Oct")
                    break;
                case "10":
                    setWatchMonth("Nov")
                    break;
                case 11:
                    setWatchMonth("Dec")
                    break;
                default:
                    setWatchMonth("???")
            }
            onSnapshot(doc(db,"users",snapshot.data().author), authorSnapshot => {
                setVideoDetails({
                    title:snapshot.data().title,
                    description:snapshot.data().description,
                    video:snapshot.data().video,
                    day:d.getUTCDate(),
                    year:d.getFullYear(),
                    month:watchMonth,
                    authorName:authorSnapshot.data().name,
                    authorImg:authorSnapshot.data().avatar,
                    authorId:snapshot.data().author,
                    views:snapshot.data().viewers.length,
                    likes:snapshot.data().likers.length,
                    dislikes:snapshot.data().dislikers.length
                })
            })
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id, watchMonth])

    const viewCheck = () => {
        if(user){
            onSnapshot(doc(db,"videos",id), snapshot => {
                if(!snapshot.data().viewers.includes(auth.currentUser.uid)){
                    updateDoc(doc(db,"videos",id),{
                        viewers:[...snapshot.data().viewers, auth.currentUser.uid]
                    })
                }
            })
        }
    }

    const goToChannel = () => {
        navigate(`/channel/${videoDetails.authorId}`)
    }

    const handleLike = () => {
        if(!user)return toast.warning("You must be signed in");
        onSnapshot(doc(db,"videos",id), snapshot => {
            if(!snapshot.data().likers.includes(auth.currentUser.uid)){
                updateDoc(doc(db,"videos",id),{
                    likers:[...snapshot.data().likers, auth.currentUser.uid],
                })
                //if(snapshot.data().dislikers.includes(auth.currentUser.uid)){
                //    updateDoc(doc(db,"videos",id),{
                //        dislikers:[...snapshot.data().dislikers.filter(disliker => disliker !== auth.currentUser.uid)],
                //    })
                //}
            }
        })
    }

    const handleDislike = () => {
        if(!user)return toast.warning("You must be signed in");
        onSnapshot(doc(db,"videos",id), snapshot => {
            if(!snapshot.data().dislikers.includes(auth.currentUser.uid)){
                updateDoc(doc(db,"videos",id),{
                    dislikers:[...snapshot.data().dislikers, auth.currentUser.uid],
                })
                //if(snapshot.data().likers.includes(auth.currentUser.uid)){
                //    updateDoc(doc(db,"videos",id),{
                //        likers:[...snapshot.data().likers.filter(liker => liker !== auth.currentUser.uid)],
                //    })
                //}
            }
        })
    }

    return (<div id="watch">
        <div id="watch-container">
            <video id="watchVideo" src={videoDetails.video} width="300" height="200" autoPlay controls/>
            <p id="watchTitle">{videoDetails.title}</p>
            <p id="watchDate">
                {videoDetails.views} views | &nbsp;
                {`${videoDetails.month} ${videoDetails.day}, ${videoDetails.year}`}
            </p>
            <br/>
            <div id="watchPoll">
                <div id="like" onClick={handleLike}>
                    <ThumbUpOutlinedIcon/>
                    {videoDetails.likes}
                </div>
                <div id="dislike" onClick={() => handleDislike()}>
                    <ThumbDownOutlinedIcon/>
                    {videoDetails.dislikes}
                </div>
            </div>
            <br/>
            <div id="watchAuthor" onClick={goToChannel}>
                <img src={videoDetails.authorImg} alt=""/>
                <p>{videoDetails.authorName}</p>
            </div>
            <br/>
            <details id="watchDescription">
                <summary></summary>
                <br/>
                <textarea value={videoDetails.description} readOnly></textarea>
            </details>
        </div>
    </div>)
}