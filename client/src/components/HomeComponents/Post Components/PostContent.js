import React, { useState } from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { deletePost } from '../../../helpers';
import { DELETING } from '../../../helpers/actionTypes';
import PostBody from './PostBody';
import PostHead from './PostHead';

const PostContent = ({ post }) => {
  const [editing, setEditing] = useState(null);
  const userLoggedIn = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();

  const renderDropdown = () => {
    const dropdownJSX = (
      <Dropdown
        icon="options"
        className="icon"
        style={{ position: 'absolute', top: '20px', right: '20px' }}
      >
        <Dropdown.Menu className="left">
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
        </Dropdown.Menu>
      </Dropdown>
    );
    if (post.shared_by) {
      if (post.shared_by === userLoggedIn._id) {
        return dropdownJSX;
      } else return null;
    } else if (post.author._id === userLoggedIn._id) return dropdownJSX;
  };

  return (
    <div className="post_display">
      <PostHead
        author={post.author}
        author_name={post.share_author || post.author._id_name}
        shared={post.shared_by ? true : false}
        date={post.date_shared || post.date_created}
      >
        {renderDropdown()}
      </PostHead>
      <PostBody
        shared={post.shared_by ? true : false}
        image={post.post_image}
        body={post.shared_by ? post.share_body : post.body}
        id={post._id}
        editing={editing}
        setEditing={setEditing}
      />
      {post.shared_by ? (
        <div className="post_share-info">
          <PostHead
            author={post.author._id}
            author_name={post.author._id_name}
            date={post.date_created}
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
