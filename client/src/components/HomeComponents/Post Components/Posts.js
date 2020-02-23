import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PostPlaceholder from './PostPlaceholder';
import PostActions from './PostActions';
import '../../../styles/post.css';
import PostContent from './PostContent';

const Posts = props => {
  const posts = useSelector(({ postsData }) => postsData.posts);
  const postLoading = useSelector(({ postsData }) => postsData.postLoading);

  posts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

  const postJsx = post => {
    return (
      <div key={post._id}>
        <PostContent post={post} />
        <PostActions
          likes={post.likes}
          comments={post.comments}
          id={post._id}
        />
      </div>
    );
  };

  const displayPosts = () => {
    if (postLoading) {
      return (
        <React.Fragment>
          <PostPlaceholder />
          <PostPlaceholder />
          <PostPlaceholder />
        </React.Fragment>
      );
    } else if (props.posts) {
      return props.posts.map(post => {
        return postJsx(post);
      });
    } else
      return posts.map(post => {
        return postJsx(post);
      });
  };

  return <div>{displayPosts()}</div>;
};

export default Posts;
