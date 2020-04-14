import React from 'react';
import { useSelector } from 'react-redux';

import PostPlaceholder from './PostPlaceholder';
import PostActions from './PostActions';
import '../../../styles/postDisplay.css';
import PostStats from './PostStats';
import PostHead from './PostHead';
import PostBody from './PostBody';

/**
 * MAIN COMPONENT
 * - responsible for displaying all post
 */
const Posts = (props) => {
  const posts = useSelector(({ postsData }) => postsData.posts);
  const postLoading = useSelector(({ postsData }) => postsData.postLoading);

  posts.sort(
    (a, b) =>
      new Date(b.date_shared ? b.date_shared : b.date_created) -
      new Date(a.date_shared ? a.date_shared : a.date_created)
  );

  const postJsx = (post, i) => {
    return (
      <div className="post_display" key={i}>
        <PostHead post={post} />
        <PostBody post={post} />
        <PostStats stats={post.stats} />
        <PostActions post={post} />
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
      return props.posts.map((post, i) => {
        return postJsx(post, i);
      });
    } else
      return posts.map((post, i) => {
        return postJsx(post, i);
      });
  };

  return <div className="all-posts">{displayPosts()}</div>;
};

export default Posts;
