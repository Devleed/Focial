import React from 'react';
import { useSelector } from 'react-redux';

import '../../styles/rightSidebar.css';

/** MAIN COMPONENT
 * - responsible for displaying contact list of logged in user
 */
const Rightsidebar = (props) => {
  // getting logged in user from redux store
  const user = useSelector(({ auth }) => auth.user);

  const renderFriends = () => {
    // mapping through user's friends
    return user.friends.map((friend) => {
      return (
        <li
          to={`#!`}
          key={friend._id}
          onClick={() => {
            props.setShowChatBox(true);
            props.setSelectedChat(friend._id);
          }}
        >
          <img
            className="small-picture"
            src={friend.profile_picture}
            alt="profile picture"
          />
          <p>{friend.name}</p>
          <span />
        </li>
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
