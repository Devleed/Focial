import {
  GET_POST,
  CREATE_POST,
  LIKE_POST,
  COMMENT_POST,
  UNLIKE_POST,
  POST_LOADING,
  COMMENT_LOADED,
  RESET_POSTS,
  DELETE_POST,
  EDIT_POST,
  SHARE_POST,
  UPDATE_STATS,
  SELECTED_POST,
  DESTROY_POST
} from '../helpers/actionTypes';

const INITIAL_STATE = {
  posts: [],
  postLoading: null,
  selectedPost: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_LOADING:
      return { ...state, postLoading: action.payload };
    case GET_POST:
      let allPosts = [...state.posts, ...action.payload];
      console.log(allPosts);
      return {
        ...state,
        posts: Array.from(new Set(allPosts.map(post => post._id))).map(id =>
          allPosts.find(post => post._id === id)
        )
      };
    case CREATE_POST:
      return { ...state, posts: [...state.posts, { ...action.payload }] };
    case COMMENT_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload.id) {
            return {
              ...post,
              comments: [...post.comments, action.payload.comment],
              stats: { ...post.stats, ...action.payload.stats }
            };
          } else return post;
        }),
        selectedPost: state.selectedPost
          ? state.selectedPost._id === action.payload.id
            ? {
                ...state.selectedPost,
                comments: [
                  ...state.selectedPost.comments,
                  action.payload.comment
                ],
                stats: { ...state.selectedPost.stats, ...action.payload.stats }
              }
            : state.selectedPost
          : null
      };
    case UNLIKE_POST:
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) {
            return { ...post, ...action.payload };
          } else return post;
        }),
        selectedPost: state.selectedPost
          ? state.selectedPost._id === action.payload.id
            ? { ...state.selectedPost, ...action.payload }
            : state.selectedPost
          : null
      };
    case COMMENT_LOADED:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload.id)
            return { ...post, comments: action.payload.comments };
          else return post;
        }),
        selectedPost: state.selectedPost
          ? state.selectedPost._id === action.payload.id
            ? { ...state.selectedPost, comments: action.payload.comments }
            : state.selectedPost
          : null
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload._id),
        selectedPost: state.selectedPost
          ? state.selectedPost._id === action.payload._id
            ? null
            : state.selectedPost
          : null
      };
    case EDIT_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) {
            return { ...post, body: action.payload.body };
          }
          return post;
        })
      };
    case RESET_POSTS:
      return {
        posts: [],
        postLoading: null
      };
    case SHARE_POST:
      return {
        ...state,
        posts: [...state.posts, action.payload]
      };
    case UPDATE_STATS:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload.id) {
            return {
              ...post,
              stats: { ...post.stats, ...action.payload.stats }
            };
          } else return post;
        }),
        selectedPost: state.selectedPost
          ? state.selectedPost._id === action.payload.id
            ? {
                ...state.selectedPost,
                stats: { ...state.selectedPost.stats, ...action.payload.stats }
              }
            : state.selectedPost
          : null
      };
    case SELECTED_POST:
      return {
        ...state,
        selectedPost: action.payload
      };
    case DESTROY_POST:
      return {
        ...state,
        selectedPost: null
      };
    default:
      return state;
  }
};
