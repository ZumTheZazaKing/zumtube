import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from '../firebase';
import { Context } from "../context/Context";
import { onSnapshot, doc, updateDoc, arrayRemove } from "@firebase/firestore";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { toast } from 'react-toastify';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import uniqid from 'uniqid';
import '../styles/Watch.css';

const Comment = lazy(() => import('./Comment').then(module =>({default:module.Comment})));

export const Watch = () => {

    const { id } = useParams();
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [watchMonth, setWatchMonth] = useState(null)
    const [contextMenu, setContextMenu] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState("");
    const [comment, setComment] = useState("");
    
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
        comments:[]
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
                    comments:snapshot.data().comments.reverse()
                })
            })
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id, watchMonth])

    const handleContextMenu = (event) => {

        if(event.target.className !== "comment")return;
        setSelectedCommentId(event.target.id);

        event.preventDefault();
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

    const handleDelete = () => {
        handleClose();
        setDeleteOpen(true);
    }
    
    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };
    const handleDeleteYes = async() => {
        handleDeleteClose();

        const [victimObject] = videoDetails.comments.filter(commentDoc => 
            commentDoc.commentId === selectedCommentId)

        await updateDoc(doc(db,'videos',id),{
            comments:arrayRemove(victimObject)
        })
        .then(() => toast.success("Comment deleted"))
        .catch(err => toast.error("Something went wrong"))

    }

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

    const createComment = e => {
        e.preventDefault();

        if(!comment)return toast.warning("Comment something!");

        const currentTime = new Date().toUTCString();

        onSnapshot(doc(db,"users",auth.currentUser.uid), snapshot => {
            updateDoc(doc(db,"videos",id), {
                comments:[...videoDetails.comments,{
                    name:snapshot.data().name,
                    comment:comment,
                    avatar:snapshot.data().avatar,
                    createdAt:currentTime,
                    id:snapshot.id,
                    commentId:uniqid()
                }]
            }).then(() => setComment(""));
        })

    }

    return (<div id="watch">
        <div id="watch-container">
            <video id="watchVideo" src={videoDetails.video} width="300" height="200" autoPlay controls/>
            <p id="watchTitle">{videoDetails.title}</p>
            <p id="watchDate">
                {videoDetails.views} views&#8226;
                {`${videoDetails.month} ${videoDetails.day}, ${videoDetails.year}`}
            </p>
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
            <br/>
            <div id="watchComments">
                <p id="commentsTitle">Comments</p>
                <br/>
                <form onSubmit={e => createComment(e)}>
                    <textarea 
                    rows={5} 
                    id="commentField" 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    placeholder="'Enter' will not work properly"
                    maxLength={1500}></textarea>
                    <br/>
                    <input type="submit" value="Comment"/>
                </form>
                <br/><br/>
                <Suspense fallback={<div><CircularProgress disableShrink/></div>}>
                    {videoDetails.comments.length > 0 ?
                    videoDetails.comments && videoDetails.comments.map((commentDoc,i) => 
                        <Comment onContextMenu={handleContextMenu} info={commentDoc} key={i}/>
                    ): <h3>No comments</h3>}
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
                    <MenuItem sx={{color:"crimson"}} onClick={handleDelete}>
                        <ListItemIcon sx={{color:"crimson"}}>
                            <DeleteIcon fontSize="small"/>
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
                        The comment will be deleted
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
        </div>
    </div>)
}