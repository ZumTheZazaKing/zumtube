import Avatar from '@mui/material/Avatar';
import '../styles/Comment.css'
import moment from 'moment';
import { auth } from '../firebase';
import { useContext } from 'react';
import { Context } from '../context/Context';
import { useNavigate } from 'react-router-dom';

export const Comment = (props) => {

    const { avatar, createdAt, comment, name, id, commentId } = props.info;
    const { user } = useContext(Context);
    const navigate = useNavigate();

    return (<div className="comment" id={commentId}
    onClick={() => {navigate(`/channel/${id}`)}}
    onContextMenu={user ? (auth.currentUser.uid === id ? props.onContextMenu : () => {return}) : () => {return}}>
        <Avatar src={avatar} alt={name}/>
        <div id="commentBody">
            <p id="commentName">
                {name} <span>{moment.utc(createdAt).fromNow()}</span>
            </p>
            <p id="commentMain">{comment}</p>
        </div>
    </div>)
}