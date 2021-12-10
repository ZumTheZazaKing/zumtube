import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from '@firebase/storage';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { toast } from 'react-toastify';
import LinearProgress from '@mui/material/LinearProgress';
import '../styles/Create.css';

export const Create = () => {

    let { user } = useContext(Context);
    let navigate = useNavigate();

    useEffect(() => {
        if(!user)navigate("/");
    })

    const [videoData, setVideoData] = useState({
        title:"",
        description:"",
        video:null,
        thumbnail:null
    });

    const [uploadProgress, setUploadProgress] = useState(null);

    const onSubmit = async e => {
        e.preventDefault();

        if(!videoData.title)return toast.warning("Please insert a title");
        if(!videoData.video)return toast.warning("Please upload a video");
        if(!videoData.thumbnail)return toast.warning("Please upload a thumbnail")

        const currentDate = new Date().toLocaleDateString();
        await addDoc(collection(db,'videos'),{
            title:videoData.title,
            description:videoData.description,
            video:videoData.video,
            thumbnail:videoData.thumbnail,
            author:auth.currentUser.uid,
            createdAt:serverTimestamp(),
            date:currentDate,
            viewers:[],
            likers:[],
            dislikers:[]
        })
        .then(() => toast.success("Video created"))
        .catch(() => toast.error("Something went wrong"))

        navigate("/")
    }

    const imageUpload = async(e) => {

        if(!e.target.files[0])return;

        const storageRef = ref(storage,`/${auth.currentUser.uid}Images/${e.target.files[0].name}`);

        await uploadBytes(storageRef, e.target.files[0]);
        await getDownloadURL(ref(storage,`/${auth.currentUser.uid}Images/${e.target.files[0].name}`))
        .then(url => {setVideoData({...videoData, thumbnail:url});});
    }

    const videoUpload = async(e) => {

        if(!e.target.files[0])return;

        const storageRef = ref(storage,`/${auth.currentUser.uid}Videos/${e.target.files[0].name}`);

        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);

        },(err) => {
            toast.error("Video failed to upload")

        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                setVideoData({...videoData, video:url})
            })
        })
    }

    return (<div id="create">
        <br/>
        <h1 id="createTitle">Create Video</h1>
        <br/><br/>
        <form id="uploadForm" onSubmit={(e) => onSubmit(e)}>
            <h3>Title</h3>
            <input className="uploadTextInput" maxLength={80} style={{fontWeight:'bold'}} type="text" 
            value={videoData.title} 
            onChange={e => setVideoData({...videoData, title:e.target.value})}/>
            <br/><br/>

            <h3>Description</h3>
            <textarea style={{lineHeight:1.5}} maxLength={1000} rows={10} className="uploadTextInput"
            value={videoData.description} 
            onChange={e => setVideoData({...videoData, description:e.target.value})}></textarea>
            <br/><br/>

            <h2>Video Upload</h2>
            <br/>
            <input type="file" accept="video/*" 
            onChange={e => videoUpload(e)}/>
            
            {uploadProgress ? 
            <div id="videoUploadProgress">
                <br/><br/>
                <LinearProgress id="videoUploadProgressBar" variant="determinate" value={uploadProgress}/>
                <p id="videoUploadPercentage">{uploadProgress}%</p>
            </div> : ""}
            <br/>
            <video id="videoPreview" src={videoData.video} controls>
                Your browser does not support the video format
            </video>
            <br/><br/>

            <h2>Thumbnail Upload</h2>
            <p>(2:1) Recommended</p>
            <br/>
            <input type="file" accept="image/*" 
            onChange={(e) => imageUpload(e)}/>
            <br/>
            <img alt="" id="thumbPreview" src={videoData.thumbnail}/>
            <br/><br/>

            <input id="uploadButton" type="submit" value="Upload"/> 
            <br/><br/>
        </form>
    </div>)
}