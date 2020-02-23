import React from 'react';
import { Icon, Loader } from 'semantic-ui-react';

import { Link } from 'react-router-dom';

const PostComments = props => {
  const renderComments = () => {
    if (props.loading) return <Loader active className="comment-loader" />;
    if (props.comments) {
      if (props.comments.length === 0)
        return <div className="nocomment_text">no comments</div>;
      return props.comments.map(comment => {
        return (
          <div className="comment" key={comment._id}>
            <Icon name="user" size="large" />
            <div className="comment_text">
              <Link to="!#" style={{ color: '#008ecc', marginRight: '5px' }}>
                {comment.author_name}
              </Link>
              {comment.content}
            </div>
          </div>
        );
      });
    } else return null;
  };
  return renderComments();
};

export default PostComments;
