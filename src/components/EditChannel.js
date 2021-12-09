import { useEffect, useContext, useState } from 'react';
import { Context } from '../context/Context';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { onSnapshot, doc, updateDoc } from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import '../styles/EditChannel.css';

export const EditChannel = () => {

    const { user } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(!user)navigate("/");
    })

    const [channelDetails, setChannelDetails] = useState({
        name:"",
        avatar:"",
        description:""
    })

    useEffect(() => {
        onSnapshot(doc(db,"users",id), snapshot => {
            setChannelDetails({
                name:snapshot.data().name,
                avatar:snapshot.data().avatar,
                description:snapshot.data().description
            })
        })
    },[id])

    const imageUpload = async(e) => {
        if(!e.target.files[0])return;

        const storageRef = ref(storage,`/${id}Images/${e.target.files[0].name}`);

        await uploadBytes(storageRef, e.target.files[0])
        .catch(() => toast.error("Unable to retrieve image"));

        await getDownloadURL(ref(storage,`/${id}Images/${e.target.files[0].name}`))
        .then(url => {setChannelDetails({...channelDetails, avatar:url});})
        .catch(() => toast.error("Unable to get image reference"));
    }

    const handleSubmit = async e => {
        e.preventDefault();

        if(!channelDetails.name)return toast.warning("Please insert a channel name");

        await updateDoc(doc(db,"users",id),{
            name:channelDetails.name,
            description:channelDetails.description || "No description yet",
            avatar:channelDetails.avatar
        })
        .then(() => toast.success("Channel edited"))
        .catch(() => toast.error("Something went wrong"))

        navigate(`/channel/${id}`);

    }

    return (<div id="editChannel">
        <br/>
        <h2>Edit Channel</h2>
        <br/>
        <form id="editChannelForm" onSubmit={e => handleSubmit(e)}>
            <Avatar id="channelPicture" src={channelDetails.avatar} alt="Z"/>
            <br/>
            <input type="file" accept="image/*" 
            onChange={(e) => imageUpload(e)}/>
            <br/>
            <p>Name</p>
            <input style={{fontWeight:"bold"}} type="text" maxLength={40} value={channelDetails.name} 
            onChange={(e) => setChannelDetails({...channelDetails, name:e.target.value})}/>
            <br/>
            <p>Description</p>
            <input type="text" maxLength={100} value={channelDetails.description} 
            onChange={e => setChannelDetails({...channelDetails, description:e.target.value})}/>
            <br/>
            <input type="submit" value="Edit"/>
        </form>
    </div>)
}