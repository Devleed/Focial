import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

const styles = {
  navActiveStyle: {
    color: '#343434'
  }
};

const Leftsidebar = () => {
  const user = useSelector(({ auth }) => auth.user);
  return (
    <div className="left_sidebar">
      <ul className="left_sidebar-options">
        <NavLink to={`/user/${user._id}`} activeStyle={styles.navActiveStyle}>
          <li>
            {user.profile_picture ? (
              <div className="small-picture">
                <img src={user.profile_picture} />
              </div>
            ) : (
              <Icon name="user" />
            )}
            {user.name}
          </li>
        </NavLink>
        <NavLink to="#" activeStyle={styles.navActiveStyle}>
          <li>
            <Icon name="user" />
            Profile
          </li>
        </NavLink>
        <NavLink to="#" activeStyle={styles.navActiveStyle}>
          <li>
            <Icon name="user" />
            Profile
          </li>
        </NavLink>
        <NavLink to="#" activeStyle={styles.navActiveStyle}>
          <li>
            <Icon name="user" />
            Profile
          </li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Leftsidebar;
