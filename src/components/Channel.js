import { useEffect, useState, useContext, lazy, Suspense } from 'react';
import { Context } from '../context/Context';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, doc, onSnapshot, orderBy, query, deleteDoc, limit, startAfter, getDocs } from '@firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/Channel.css';
import { toast } from 'react-toastify';

const Video = lazy(() => import('./Video').then(module => ({default:module.Video})));

export const Channel = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const [editHide, setEditHide] = useState("hide");
    const [showPointer, setShowPointer] = useState("");
    const [showMore, setShowMore] = useState(true);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [channelInfo, setChannelInfo] = useState({
        name:"",
        description:"",
        videos:null,
        avatar:""
    })

    useEffect(() => {
        onSnapshot(doc(db,"users",id), snapshot => {
            getChannelInfo(snapshot);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const getChannelInfo = async (snapshot) => {

        const firstBatch = query(collection(db, "videos"), orderBy("createdAt","desc"), limit(10));
        await getDocs(firstBatch)
        .then(collectionSnapshot => {
            setChannelInfo({
                name:snapshot.data().name,
                description:snapshot.data().description,
                videos:[...collectionSnapshot.docs.filter(d => d.data().author === id)],
                avatar:snapshot.data().avatar
            })
        })
    }

    const handleViewMore = async () => {
        const nextBatch = query(collection(db,"videos"), orderBy("createdAt","desc"),startAfter(channelInfo.videos[channelInfo.videos.length-1].data().createdAt),limit(10));
        await getDocs(nextBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                setChannelInfo({...channelInfo, videos:[
                    ...channelInfo.videos, ...snapshot.docs.filter(d => d.data().author === id)
                ]});
            } else {
                setShowMore(false);
            }
        })
    }

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
        setDeleteOpen(true);
    }
    
    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };
    const handleDeleteYes = async() => {
        handleDeleteClose();

        await deleteDoc(doc(db,'videos',selectedId))
        .then(() => toast.success("Video deleted"))
        .catch(err => toast.error("Something went wrong"))

    }

    //Hover to edit channel
    const handleHover = () => {
        setEditHide("");
        setShowPointer("showPointer");
    }
    const handleOut = () => {
        setEditHide("hide")
        setShowPointer("")
    }
    const handleClick = () => {
        navigate(`/editchannel/${id}`);
    }

    return (channelInfo.name ? 
        <div id="channel">
            <div id="banner" className={showPointer}
            onMouseOver={user ? (auth.currentUser.uid === id ? handleHover : () => {return}) : () => {return}}
            onMouseOut={() => handleOut()}
            onClick={user ? (auth.currentUser.uid === id ? handleClick : () => {return}) : () => {return}}
            >
                <Avatar id="channelAvatar" src={channelInfo.avatar} alt="Z"/>
                <div id="channelInfo">
                    <p id="channelName">{channelInfo.name}<EditIcon className={editHide} id="editIcon" fontSize="small"/></p>
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
                <Dialog
                    open={deleteOpen}
                    onClose={handleDeleteClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    {"Are you sure?"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Once the video is deleted, it can't be restored
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleDeleteClose}>No</Button>
                    <Button variant="contained" onClick={handleDeleteYes} autoFocus>
                        Yes
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <br/>
            {channelInfo.videos ? <div id="viewMore">
                {showMore ? 
                <Button onClick={handleViewMore} className="button">View More</Button>
                : <h4>That's all for now</h4>}
            </div> : ""}
        </div> 
    : <div className="loading"><CircularProgress disableShrink/></div>)
}