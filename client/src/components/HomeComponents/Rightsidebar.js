import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import '../../styles/rightSidebar.css';

const Rightsidebar = (props) => {
  const user = useSelector(({ auth }) => auth.user);

  const renderFriends = () => {
    return user.friends.map((friend) => {
      return (
        <NavLink to={`/user/${friend._id}`} key={friend._id}>
          <img
            className="small-picture"
            src={friend.profile_picture}
            alt="profile picture"
          />
          <p>{friend.name}</p>
          <span />
        </NavLink>
      );
    });
  };

  return (
    <div className="right_sidebar">
      <h3>
        Contacts{' '}
        <img
          src="https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/mk4dH3FK0jT.png?_nc_eui2=AeFVOHwR5QDy0PFoaeDqsXTxA_bf-kPbCmUD9t_6Q9sKZfLoF6L4HxvE6vancHgr4F-KGBJ5YmXdnxaZ55PsH0xp"
          alt="group icon indicating friends"
        />
      </h3>
      {renderFriends()}
    </div>
  );
};

export default Rightsidebar;
