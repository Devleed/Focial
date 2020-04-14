import React from 'react';
import { NavLink } from 'react-router-dom';
import RequestButtons from './RequestButtons';

/**
 * MAIN COMPONENT
 * - responsible for displaying profile cards
 */
const ProfileCards = ({
  user,
  children,
  className,
  owner,
  mutualFriends,
  style,
}) => {
  return (
    <div className={`profile_card ${className} ${style}`} key={user._id}>
      <div className="profile_card-image">
        {user.cover_picture ? (
          <img src={user.cover_picture} className="card_cover-picture" />
        ) : (
          <div
            className="card_cover-picture"
            style={{ backgroundColor: 'gray' }}
          />
        )}
        <img src={user.profile_picture} className="card_profile-picture" />
      </div>
      <div className={`card_content`}>
        <NavLink to={`/user/${user._id}`}>{user.name}</NavLink>
        <p>Joined in {user.register_date.split('-')[0]}</p>
        <p>lorem ipsum doles sit amet</p>
        {owner ? null : (
          <React.Fragment>
            <span>{mutualFriends} mutual friends</span>
            <br />
            <RequestButtons user={user} style={{ margin: '20px' }} />{' '}
          </React.Fragment>
        )}
        {children}
      </div>
    </div>
  );
};

export default ProfileCards;
