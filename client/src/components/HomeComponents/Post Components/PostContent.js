import React, { useState } from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { deletePost } from '../../../helpers';
import { DELETING } from '../../../helpers/actionTypes';
import PostBody from './PostBody';
import PostHead from './PostHead';
import { NavLink } from 'react-router-dom';

const PostContent = ({ post }) => {
  const [editing, setEditing] = useState(null);
  const userLoggedIn = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();

  const renderDropdown = () => {
    const dropdownJSX = (
      <React.Fragment>
        <Dropdown.Item onClick={() => setEditing(true)}>
          <Icon name="edit" />
          Edit
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            dispatch({ type: DELETING, payload: true });
            dispatch(
              deletePost(
                post._id,
                post.post_image ? post.post_image.public_id : 'none'
              )
            );
          }}
        >
          <Icon name="delete" />
          Delete
        </Dropdown.Item>
      </React.Fragment>
    );
    if (post.share_author) {
      if (post.share_author._id === userLoggedIn._id) {
        return dropdownJSX;
      } else return null;
    } else if (post.author._id === userLoggedIn._id) return dropdownJSX;
  };

  return (
    <div className="post_display">
      <PostHead
        author={post.share_author ? post.share_author._id : post.author._id}
        author_name={
          post.share_author ? post.share_author.name : post.author.name
        }
        shared={post.share_author ? true : false}
        date={post.date_shared || post.date_created}
        profile_picture={
          post.share_author
            ? post.share_author.profile_picture
            : post.author.profile_picture
        }
      >
        <Dropdown
          icon="options"
          className="icon"
          style={{ position: 'absolute', top: '20px', right: '20px' }}
        >
          <Dropdown.Menu className="left">
            <Dropdown.Item>
              <NavLink to={`/post/${post._id}`} style={{ color: 'black' }}>
                <Icon name="eye" />
                View
              </NavLink>
            </Dropdown.Item>
            {renderDropdown()}
          </Dropdown.Menu>
        </Dropdown>
      </PostHead>
      <PostBody
        shared={post.share_author ? true : false}
        image={post.post_image}
        body={post.share_author ? post.share_body : post.body}
        id={post._id}
        editing={editing}
        setEditing={setEditing}
      />
      {post.share_author ? (
        <div className="post_share-info">
          <PostHead
            author={post.author._id}
            author_name={post.author.name}
            date={post.date_created}
            profile_picture={post.author.profile_picture}
          />
          <div
            className={`post_content ${
              post.post_image ? 'post_content-long' : null
            }`}
          >
            {post.body}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostContent;
