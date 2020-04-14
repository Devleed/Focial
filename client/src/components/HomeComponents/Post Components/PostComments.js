import React from 'react';
import { Icon } from 'semantic-ui-react';
import Loader from '../../Loader';

import { NavLink } from 'react-router-dom';

/**
 * MAIN COMPONENT
 * - responsible for manage comments of a post
 */
const PostComments = (props) => {
  const renderComments = () => {
    if (props.loading) return <Loader />;

    if (props.comments && props.stats > 0) {
      return props.comments.map((comment) => {
        return (
          <div className="comment_display" key={comment._id}>
            <img
              className="small-picture-post"
              src={comment.author.profile_picture || ''}
            />
            <div className="comment_content">
              <NavLink to={`/user/${comment.author._id}`}>
                {comment.author.name}
              </NavLink>
              <p>{comment.content}</p>
            </div>
            <Icon name="ellipsis horizontal" />
          </div>
        );
      });
    } else return <div className="nocomment_text">no comments</div>;
  };
  return renderComments();
};

export default PostComments;
