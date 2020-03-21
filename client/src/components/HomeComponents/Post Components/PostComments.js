import React from 'react';
import { Icon, Loader } from 'semantic-ui-react';

import { Link } from 'react-router-dom';

const PostComments = props => {
  const renderComments = () => {
    if (props.loading) return <Loader active className="comment-loader" />;

    if (props.comments && props.stats > 0) {
      return props.comments.map(comment => {
        return (
          <div className="comment" key={comment._id}>
            {comment.author.profile_picture ? (
              <div className="post_author-dp">
                <img src={comment.author.profile_picture} />
              </div>
            ) : (
              <Icon name="user" size="large" />
            )}
            <div className="comment_text">
              <Link
                to={`/user/${comment.author._id}`}
                style={{ color: '#008ecc', marginRight: '5px' }}
              >
                {comment.author.name}
              </Link>
              {comment.content}
            </div>
          </div>
        );
      });
    } else return <div className="nocomment_text">no comments</div>;
  };
  return renderComments();
};

export default PostComments;
