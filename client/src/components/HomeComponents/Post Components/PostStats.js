import React from 'react';
import { Icon } from 'semantic-ui-react';

const PostStats = ({ stats }) => {
  if (stats.likes === 0 && stats.comments === 0 && stats.shares === 0)
    return null;
  return (
    <div className="post_stats">
      {stats.likes > 0 ? (
        <div className="like_stats">
          <Icon name="thumbs up" color="blue" size="small" />
          {stats.likes}
        </div>
      ) : null}
      {stats.comments > 0 ? (
        <div className="comment_stats">{stats.comments} comments</div>
      ) : null}
      {stats.shares ? (
        <div className="share_stats">{stats.shares} shares</div>
      ) : null}
    </div>
  );
};

export default PostStats;
