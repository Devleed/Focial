import React, { useEffect } from 'react';
import PostActions from './PostActions';
import PostStats from './PostStats';
import PostHead from './PostHead';
import PostBody from './PostBody';
import { useDispatch, useSelector } from 'react-redux';
import { findPost } from '../../../helpers';
import Loader from '../../Loader';
import Navbar from '../../Navbar';
import { DESTROY_POST } from '../../../helpers/actionTypes';

const PostDisplay = props => {
  const dispatch = useDispatch();
  const post = useSelector(({ postsData }) => postsData.selectedPost);

  useEffect(() => {
    (() => {
      dispatch(findPost(props.match.params.id));
    })();
    return () => {
      dispatch({ type: DESTROY_POST });
    };
  }, [dispatch, props.match.params.id]);

  const renderPage = () => {
    if (post)
      return (
        <div className="post_display main_display">
          <PostHead post={post} />
          <PostBody post={post} />
          <PostStats stats={post.stats} />
          <PostActions post={post} />
        </div>
      );
    else return <Loader />;
  };

  return (
    <React.Fragment>
      <Navbar />
      {renderPage()}
    </React.Fragment>
  );
};

export default PostDisplay;
