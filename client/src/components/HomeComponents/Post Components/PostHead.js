import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const PostHead = ({ author, date, shared, children }) => {
  return (
    <div className="post_meta">
      {author.profile_picture ? (
        <div className="post_author-dp">
          <img src={author.profile_picture} />
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
        <Link to={`/user/${author._id}`} className="post_author">
          {author.name}
        </Link>
        {shared ? ' shared a post' : null}
        <br />
        <span className="post_date">
          {new Date(date).toLocaleDateString('en-US')}
        </span>
      </div>
      {children}
    </div>
  );
};

export default PostHead;
