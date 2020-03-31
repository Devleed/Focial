import React from 'react';
import { useSelector } from 'react-redux';

import '../../styles/leftSidebar.css';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

const LeftSidebar = () => {
  const user = useSelector(({ auth }) => auth.user);

  return (
    <div className="left-sidebar">
      <div className="top">
        <img src="https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg" />
        <div>
          <img src={user.profile_picture} />
          <NavLink to={`/user/${user._id}`}>{user.name}</NavLink>
        </div>
      </div>
      <div className="middle">
        <li>
          <Icon name="home" />
          Home
        </li>
        <li>
          <Icon name="users" />
          Friends
        </li>
        <li>
          <Icon name="paste" />
          Posts
        </li>
        <li>
          <Icon name="rss" />
          Messages
        </li>
      </div>
      <div className="bottom">
        <button>
          <Icon name="arrow up" />
          Back to top
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
