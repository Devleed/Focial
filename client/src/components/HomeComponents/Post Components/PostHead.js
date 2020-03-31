import React from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { calculateDate } from '../../../helpers';
import DeletePost from './DeletePost';

const renderProfilePicture = post => {
  return (
    post.author.profile_picture ||
    'https://www.kindpng.com/picc/m/22-223965_no-profile-picture-icon-circle-member-icon-png.png'
  );
};

const PostHead = ({ post }) => {
  const userLoggedIn = useSelector(({ auth }) => auth.user);

  const renderDropdown = () => {
    const dropdownJSX = (
      <React.Fragment>
        <Dropdown.Item>
          <Icon name="edit" />
          Edit
        </Dropdown.Item>
        <DeletePost post={post} />
      </React.Fragment>
    );
    if (post.author._id === userLoggedIn._id) return dropdownJSX;
    else return null;
  };

  return (
    <div className="post_head">
      <img src={renderProfilePicture(post)} />
      <div className="post_meta">
        <strong>
          <NavLink to={post.author._id}>{post.author.name}</NavLink>
        </strong>{' '}
        {post.date_shared ? 'shared a post' : ''}
        <br />
        <span>{calculateDate(post.date_shared || post.date_created)}</span>
      </div>
      <Dropdown icon="ellipsis horizontal" className="icon">
        <Dropdown.Menu className="left">
          <Dropdown.Item>
            <NavLink to={`/post/${post._id}`}>
              <Icon name="eye" />
              View
            </NavLink>
          </Dropdown.Item>
          {renderDropdown()}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default PostHead;
