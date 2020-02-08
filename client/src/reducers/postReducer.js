import {
  GET_POST,
  CREATE_POST,
  LIKE_POST,
  COMMENT_POST,
  UNLIKE_POST
} from '../helpers/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_POST:
      return action.payload;
    case CREATE_POST:
      return [...state, { ...action.payload }];
    case COMMENT_POST:
    case UNLIKE_POST:
    case LIKE_POST:
      return state.map(post => {
        if (post._id === action.payload._id) {
          return { ...action.payload };
        } else return post;
      });
    default:
      return state;
  }
};
