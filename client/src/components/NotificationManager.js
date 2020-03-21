import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { calculateDate } from '../helpers';

const NotificationManager = () => {
  const notifications = useSelector(({ notifications }) => notifications);

  const displayNotifications = () => {
    return notifications.map(notification => {
      return (
        <Dropdown.Item key={notification._id}>
          <NavLink
            to={`/post/${notification.post}`}
            style={{ color: 'black' }}
            className="notification_item"
          >
            <img
              src={notification.by.profile_picture}
              className="post_author-dp"
              style={{ borderRadius: '60%', width: '30px' }}
            />
            <span>
              <strong>{notification.by.name + ' '}</strong>
              {notification.content}
              <br />
              <span>{calculateDate(notification.date)}</span>
            </span>
          </NavLink>
        </Dropdown.Item>
      );
    });
  };

  return (
    <Dropdown.Menu>
      <Dropdown
        icon="bell"
        style={{ color: 'white' }}
        floating
        className="icon"
      >
        <Dropdown.Menu
          style={{ width: '360px', paddingBottom: '10px', paddingRight: '5px' }}
          className="left"
        >
          <Dropdown.Header content="Notifications" />
          {displayNotifications()}
        </Dropdown.Menu>
      </Dropdown>
    </Dropdown.Menu>
  );
};

export default NotificationManager;
