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
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/WcCzeboYevF.png?_nc_eui2=AeERAomcV8ttQdDlt3iLzDG_yYVpW3Hmh7XJhWlbceaHtbDT4c5U8BOAlwJfhNxbipb6-8ImgSaOcB5kqNYG9C6l"
            alt="home indicator"
          />
          Home
        </li>
        <li>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/mk4dH3FK0jT.png?_nc_eui2=AeFVOHwR5QDy0PFoaeDqsXTxA_bf-kPbCmUD9t_6Q9sKZfLoF6L4HxvE6vancHgr4F-KGBJ5YmXdnxaZ55PsH0xp"
            alt="group icon indicating friends"
          />
          Friends
        </li>
        <li>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/i7hepQ2OeZg.png?_nc_eui2=AeG-LFxTaXtM6EDYu6nlLoiLIucpu18fVQgi5ym7Xx9VCDbp-o0YTzx0N0covr-Y-nIX2cxcM9gcWqBrsIX5o4kk"
            alt="flag icon indicating posts"
          />
          Posts
        </li>
        <li>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/QAyfjudAqqG.png?_nc_eui2=AeH9EhojJbB_i3EcCcCAiPiqKwEv14JBhfkrAS_XgkGF-d9khOOkYWmk7GIzoex_8VYzfc19IavF7QyZPe2jtped"
            alt="messages icon indicating messages"
          />
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
