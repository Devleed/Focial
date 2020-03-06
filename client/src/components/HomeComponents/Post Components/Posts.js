import React from 'react';
import { useSelector } from 'react-redux';

import PostPlaceholder from './PostPlaceholder';
import PostActions from './PostActions';
import '../../../styles/post.css';
import PostContent from './PostContent';
import PostStats from './PostStats';

const Posts = props => {
  const posts = useSelector(({ postsData }) => postsData.posts);
  const postLoading = useSelector(({ postsData }) => postsData.postLoading);

  posts.sort(
    (a, b) =>
      new Date(b.date_shared ? b.date_shared : b.date_created) -
      new Date(a.date_shared ? a.date_shared : a.date_created)
  );

  const postJsx = (post, i) => {
    return (
      <div key={i}>
        <PostContent post={post} />
        <PostStats
          likes={post.likes ? post.likes.length : 0}
          comments={post.comments ? post.comments.length : 0}
        />
        <PostActions
          likes={post.likes}
          comments={post.comments}
          id={post._id}
          post_image={post.post_image}
          shared={post.shared_by}
          author={post.author}
          author_name={post.author_name}
          date_created={post.date_created}
          body={post.body}
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
      return props.posts.map((post, i) => {
        return postJsx(post, i);
      });
    } else
      return posts.map((post, i) => {
        return postJsx(post, i);
      });
  };

  return <div>{displayPosts()}</div>;
};

export default Posts;
