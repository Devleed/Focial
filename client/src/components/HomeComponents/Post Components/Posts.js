import React from 'react';
import { useSelector } from 'react-redux';
import { calculateDate } from '../../../helpers';
import { Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import PostPlaceholder from './PostPlaceholder';
import PostActions from './PostActions';
// import '../../../styles/post.css';
import '../../../styles/postDisplay.css';
import PostContent from './PostContent';
import PostStats from './PostStats';
import PostHead from './PostHead';
import PostBody from './PostBody';

// const renderBody = (text, data) => {
//   let urlRegex = /(https?:\/\/[^\s]+)/g;
//   return text.split(urlRegex).map((t, index) => {
//     if (!t.match(urlRegex)) return <p key={index}>{t}</p>;
//     return (
//       <a key={index} href={t} target="_blank" style={{ color: '#008ecc' }}>
//         {data ? (
//           <div className="scraped_data">
//             <img src={data[0].image} alt={`${data[0].title} image`} />
//             <div>
//               <h1>{data[0].title}</h1>
//               <span>{data[0].url}</span>
//               <p>{data[0].description}</p>
//             </div>
//           </div>
//         ) : (
//           t
//         )}
//       </a>
//     );
//   });
// };

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
/**
 * {
    "stats": {
        "likes": 0,
        "comments": 0,
        "shares": 0
    },
    "content": "",
    "date_shared": "2020-03-30T16:49:33.850Z",
    "_id": "5e8224088457f422acfe5819",
    "author": {
        "profile_picture": "",
        "_id": "5e81ac1c9ea2e525e0ef821c",
        "name": "shikan ji",
        "email": "s@gmail.com"
    },
    "post": {
        "_id": "5e8223688457f422acfe5816",
        "author": {
            "profile_picture": "",
            "_id": "5e81abd79ea2e525e0ef821b",
            "name": "Ellen james",
            "email": "e@gmail.com"
        },
        "body": "first post"
    },
    "__v": 0,
    "likes": []
}
 */
