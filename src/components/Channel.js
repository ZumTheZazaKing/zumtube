import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, onSnapshot, orderBy, query } from '@firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/Channel.css';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Channel = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [channelInfo, setChannelInfo] = useState({
        name:"",
        description:"",
        videos:null,
        avatar:""
    })

    useEffect(() => {
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

    const [contextMenu, setContextMenu] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const handleContextMenu = (event) => {

        if(!event.target.parentNode.className)return;

        event.preventDefault();
        setSelectedId(event.target.parentNode.id)
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
            }
            : null,
        );
    };
    const handleClose = () => {
        setContextMenu(null);
    };

    const handleEdit = () => {
        handleClose();
        navigate(`/edit/${selectedId}`)
    }

    const handleDelete = () => {
        handleClose();
        console.log(selectedId)
    }

    return (channelInfo.name ? 
        <div id="channel">
            <div id="banner">
                <img id="channelAvatar" src={channelInfo.avatar} alt=""/>
                <div id="channelInfo">
                    <p id="channelName">{channelInfo.name}</p>
                    <p id="channelDescription">{channelInfo.description}</p>
                </div>
            </div>
            <div id="videos">
                <Suspense fallback={<div><CircularProgress disableShrink/></div>}>
                    {channelInfo.videos ? channelInfo.videos && channelInfo.videos.map((video, i) => 
                        <Video onContextMenu={handleContextMenu} info={video} key={i}/>
                    ) : <h2>No videos available</h2>}
                </Suspense>
                <Menu
                    open={contextMenu !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                    }
                >
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditIcon fontSize="small"/>
                        </ListItemIcon>
                        Edit
                    </MenuItem>
                    <MenuItem sx={{color:"crimson"}} onClick={handleDelete}>
                        <ListItemIcon>
                            <DeleteIcon sx={{color:"crimson"}} fontSize="small"/>
                        </ListItemIcon>
                        Delete
                    </MenuItem>
                </Menu>
            </div>
        </div> 
    : <div className="loading"><CircularProgress disableShrink/></div>)
}