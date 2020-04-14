import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  calculateDate,
  notificationOpened,
  notificationSeen,
} from '../helpers';

/**
 * MAIN COMPONENT
 * - responsible for displaying dropdown of notification and managing them
 */
const NotificationManager = () => {
  // select notifications from redux store
  const notificationData = useSelector(
    ({ notificationData }) => notificationData
  );
  const dispatch = useDispatch();

  // sort them in descending order by date
  notificationData.notifications.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // filter out the length of unseen notifications
  let unseen = notificationData.notifications.filter(
    (notification) => notification.status === 0
  ).length;

  // function to siplay notifications
  const displayNotifications = () => {
    return notificationData.notifications.map((notification) => {
      return (
        <Dropdown.Item
          key={notification._id}
          onClick={() => dispatch(notificationOpened(notification._id))}
        >
          <NavLink
            to={`/post/${notification.post}`}
            style={{ color: 'black' }}
            className={`notification_item ${
              notification.status === 0 || notification.status === 2
                ? 'unread'
                : null
            }`}
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
            {notification.status !== 1 ? (
              <span className="unread-alert" />
            ) : null}
          </NavLink>
        </Dropdown.Item>
      );
    });
  };

  return (
    <React.Fragment>
      <Dropdown
        icon="bell"
        style={{ color: 'white' }}
        floating
        className="icon"
        onClick={() => {
          if (unseen > 0) dispatch(notificationSeen());
          unseen = 0;
        }}
      >
        <Dropdown.Menu
          style={{
            width: '360px',
            paddingBottom: '10px',
            paddingRight: '5px',
            overflowY: 'auto',
            maxHeight: '550px',
          }}
          className="left"
        >
          <Dropdown.Header content="Notifications" />
          {displayNotifications()}
        </Dropdown.Menu>
      </Dropdown>
      {unseen > 0 ? (
        <p className="notification-number number">{unseen}</p>
      ) : null}
    </React.Fragment>
  );
};

export default NotificationManager;
