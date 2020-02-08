import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import PostActions from './PostActions';
import '../../../styles/post.css';

const Posts = () => {
  const posts = useSelector(({ posts }) => posts);

  posts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

  const displayPosts = () => {
    return posts.map(post => {
      return (
        <div key={post._id}>
          <div className="post_display">
            <div className="post_meta">
              <Icon
                name="user"
                size="big"
                color="grey"
                style={{ marginTop: '5px' }}
              />
              <div className="post_info">
                <Link to="!#" className="post_author">
                  {post.author_name}
                </Link>
                <br />
                <span className="post_date">{post.date_created}</span>
              </div>
            </div>
            <div className="post_content">{post.body}</div>
          </div>
          <PostActions
            likes={post.likes}
            comments={post.comments}
            id={post._id}
          />
        </div>
      );
    });
  };

  return <div>{displayPosts()}</div>;
};

export default Posts;
