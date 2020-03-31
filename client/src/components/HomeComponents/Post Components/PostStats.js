import React from 'react';
import { Icon } from 'semantic-ui-react';

const PostStats = ({ stats }) => {
  return (
    <div className="post_stats">
      <div className="like_stats">
        {stats.likes > 0 ? (
          <React.Fragment>
            <Icon name="thumbs up" color="blue" size="small" />
            {stats.likes}
          </React.Fragment>
        ) : null}
      </div>
      <div className={`${stats.shares ? 'comment_stats' : 'share_stats'}`}>
        {stats.comments > 0 ? (
          <React.Fragment>{stats.comments} comments</React.Fragment>
        ) : null}
      </div>
      <div className="share_stats">
        {stats.shares ? (
          <React.Fragment>{stats.shares} shares</React.Fragment>
        ) : null}
      </div>
    </div>
  );
};

export default PostStats;
