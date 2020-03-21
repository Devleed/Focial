import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { calculateDate } from '../../../helpers';

const PostHead = ({
  author,
  author_name,
  profile_picture,
  date,
  shared,
  children
}) => {
  return (
    <div className="post_meta">
      {profile_picture ? (
        <div className="post_author-dp">
          <img src={profile_picture} />
        </div>
      ) : (
        <Icon
          name="user"
          size="big"
          color="grey"
          style={{ marginTop: '8px' }}
        />
      )}
      <div className="post_info">
        <Link to={`/user/${author}`} className="post_author">
          {author_name}
        </Link>
        {shared ? ' shared a post' : null}
        <br />
        <span className="post_date">{calculateDate(date)}</span>
      </div>
      {children}
    </div>
  );
};

export default PostHead;
