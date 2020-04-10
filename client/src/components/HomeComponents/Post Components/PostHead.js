import React from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { calculateDate } from '../../../helpers';
import DeletePost from './DeletePost';
import EditPost from './EditPost';

const PostHead = ({ post }) => {
  const userLoggedIn = useSelector(({ auth }) => auth.user);

  const renderDropdown = () => {
    const dropdownJSX = (
      <React.Fragment>
        <EditPost post={post} />
        <DeletePost post={post} />
      </React.Fragment>
    );
    if (post.author._id === userLoggedIn._id) return dropdownJSX;
    else return null;
  };

  return (
    <div className="post_head">
      <img src={post.author.profile_picture} />
      <div className="post_meta">
        <strong>
          <NavLink to={post.author._id}>{post.author.name}</NavLink>
        </strong>{' '}
        {post.date_shared ? 'shared a post' : ''}
        <br />
        <span>{moment(post.date_shared || post.date_created).fromNow()}</span>
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
