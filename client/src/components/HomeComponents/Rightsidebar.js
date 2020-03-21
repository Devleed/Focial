import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Rightsidebar = () => {
  const user = useSelector(({ auth }) => auth.user);

  const renderFriends = () => {
    if (user.friendsInfo)
      return user.friendsInfo.map(friend => {
        return (
          <NavLink to={`/user/${friend._id}`} key={friend._id}>
            <img
              className="small-picture"
              src={
                friend.profile_picture
                  ? friend.profile_picture
                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
              }
              alt="profile-picture"
            />
            <p>{friend.name}</p>
            <Icon name="dot circle" color="green" size="tiny" />
          </NavLink>
        );
      });
    else return null;
  };

  return <div className="right_sidebar">{renderFriends()}</div>;
};

export default Rightsidebar;
