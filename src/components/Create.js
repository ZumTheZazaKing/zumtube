import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
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

    const onSubmit = async e => {
        e.preventDefault();
        const currentDate = new Date().toLocaleString();
        console.log("WRYYY");
        navigate("/")
    }

    const imageUpload = async(e) => {

        if(!e.target.files[0])return;

        console.log(e.target.files[0]);

        const storageRef = ref(storage,`/${auth.currentUser.uid}Images/${e.target.files[0].name}`);

        await uploadBytes(storageRef, e.target.files[0]);
        await getDownloadURL(ref(storage,`/${auth.currentUser.uid}Images/${e.target.files[0].name}`))
        .then(url => {setVideoData({...videoData, thumbnail:url}); console.log(url)});

    }

    const videoUpload = async(e) => {

        if(!e.target.files[0])return;

        console.log(e.target.files[0]);

        const storageRef = ref(storage,`/${auth.currentUser.uid}Videos/${e.target.files[0].name}`);

        await uploadBytes(storageRef, e.target.files[0]);
        await getDownloadURL(ref(storage,`/${auth.currentUser.uid}Videos/${e.target.files[0].name}`))
        .then(url => {setVideoData({...videoData, video:url}); console.log(url)});

    }

    return (<div id="create">
        <h1>Create Video</h1>
        <form onSubmit={(e) => onSubmit(e)}>
            <h3>Title</h3>
            <input type="text" 
            value={videoData.title} 
            onChange={e => setVideoData({...videoData, title:e.target.value})} 
            required/>
            <br/><br/>

            <h3>Description</h3>
            <textarea 
            value={videoData.description} 
            onChange={e => setVideoData({...videoData, description:e.target.value})} 
            required></textarea>
            <br/><br/>

            <h2>Video Upload</h2>
            <input type="file" accept="video/*" 
            onChange={e => videoUpload(e)}required/>
            <br/>
            <video id="videoPreview" src={videoData.video} controls>
                Your browser does not support the video format
            </video>
            <br/><br/>

            <h2>Thumbnail Upload</h2>
            <input type="file" accept="image/*" 
            onChange={(e) => imageUpload(e)} required/>
            <br/>
            <img alt="" id="thumbPreview" src={videoData.thumbnail}/>
            <br/><br/>

            <input type="submit"/> 
            <br/><br/>
        </form>
    </div>)
}