import Avatar from '@mui/material/Avatar';
import '../styles/Comment.css'
import moment from 'moment';

export const Comment = (props) => {

    const { avatar, createdAt, comment, name } = props.info;

    return (<div className="comment">
        <Avatar src={avatar} alt={name}/>
        <div id="commentBody">
            <p id="commentName">
                {name} <span>{moment.utc(createdAt).fromNow()}</span>
            </p>
            <p id="commentMain">{comment}</p>
        </div>
    </div>)
}