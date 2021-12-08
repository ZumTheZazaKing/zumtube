import { useParams } from "react-router-dom";
import { db } from '../firebase';
import { onSnapshot, doc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import '../styles/Watch.css';

export const Watch = () => {

    const { id } = useParams();
    const [watchMonth, setWatchMonth] = useState(null)
    const [videoDetails, setVideoDetails] = useState({
        title:"",
        description:"",
        video:"",
        day:"",
        month:"",
        year:""
    })

    useEffect(() => {
        
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
            setVideoDetails({
                title:snapshot.data().title,
                description:snapshot.data().description,
                video:snapshot.data().video,
                day:d.getUTCDate(),
                year:d.getFullYear(),
                month:watchMonth
            })
            
        })

    },[id, watchMonth])

    return (<div id="watch">
        <div id="watch-container">
            <video id="watchVideo" src={videoDetails.video} width="300" height="200" autoPlay controls/>
            <p id="watchTitle">{videoDetails.title}</p>
            <p id="watchDate">{`${videoDetails.month} ${videoDetails.day}, ${videoDetails.year}`}</p>
            <br/>
            <details id="watchDescription">
                <summary></summary>
                <br/>
                <textarea value={videoDetails.description} readOnly></textarea>
            </details>
        </div>
    </div>)
}