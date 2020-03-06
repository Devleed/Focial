import React from 'react';
import { Icon } from 'semantic-ui-react';

const PostStats = props => {
  return (
    <div className="post_stats">
      {props.likes > 0 ? (
        <div className="like_stats">
          <Icon name="thumbs up" color="blue" size="small" />
          {props.likes}
        </div>
      ) : null}
      <div className="comment_stats">{props.comments} comments</div>
      <div className="share_stats">1 shares</div>
    </div>
  );
};

export default PostStats;
