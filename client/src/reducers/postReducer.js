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
  SHARE_POST
} from '../helpers/actionTypes';

const INITIAL_STATE = {
  posts: [],
  postLoading: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_LOADING:
      return { ...state, postLoading: action.payload };
    case GET_POST:
      return { ...state, posts: action.payload };
    case CREATE_POST:
      return { ...state, posts: [...state.posts, { ...action.payload }] };
    case COMMENT_POST:
    case UNLIKE_POST:
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) {
            return { ...action.payload };
          } else return post;
        })
      };
    case COMMENT_LOADED:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id)
            return { ...post, comments: action.payload.comments };
          else return post;
        })
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload._id)
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
    default:
      return state;
  }
};
