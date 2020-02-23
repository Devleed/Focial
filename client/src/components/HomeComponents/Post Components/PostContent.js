import React, { useState } from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { deletePost } from '../../../helpers';
import PostBody from './PostBody';

const PostContent = props => {
  const [editing, setEditing] = useState(null);
  const userLoggedIn = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();

  return (
    <div className="post_display">
      <div className="post_meta">
        <Icon
          name="user"
          size="big"
          color="grey"
          style={{ marginTop: '5px' }}
        />
        <div className="post_info">
          <Link to={`/user/${props.post.author}`} className="post_author">
            {props.post.author_name}
          </Link>
          <br />
          <span className="post_date">
            {new Date(props.post.date_created).toLocaleDateString('en-US')}
          </span>
        </div>
        {userLoggedIn._id === props.post.author ? (
          <Dropdown
            icon="options"
            className="icon"
            style={{ position: 'absolute', top: '40px', right: '40px' }}
          >
            <Dropdown.Menu className="left">
              <Dropdown.Item onClick={() => setEditing(true)}>
                <Icon name="edit" />
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => dispatch(deletePost(props.post._id))}
              >
                <Icon name="delete" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : null}
      </div>
      {props.post.post_image ? (
        <div className="post_content-image">
          <div className="post_image-info">{props.post.body}</div>
          <img src={props.post.post_image.url} className="post_image" />
        </div>
      ) : (
        <PostBody
          body={props.post.body}
          id={props.post._id}
          editing={editing}
          setEditing={setEditing}
        />
      )}
    </div>
  );
};

export default PostContent;
