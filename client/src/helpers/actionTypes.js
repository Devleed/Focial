// auth action types
export const REGISTER_SUCCESS = 'register_success';
export const REGISTER_FAIL = 'register_fail';
export const LOAD_USER = 'load_user';
export const USER_LOAD_FAIL = 'user_load_fail';
export const USER_UNAUTHORIZED = 'user_unauthorized';
export const LOGIN_SUCCESS = 'login_success';
export const LOGIN_FAIL = 'login_fail';
export const LOGOUT_SUCCESS = 'logout_success';
export const USER_LOADING = 'user_loading';

// user action types
export const GET_FRIENDS = 'get_friends';
export const SET_SOCKET = 'set_socket';

// get emails and errors action types
export const GET_ERRORS = 'get_errors';
export const CLEAR_ERRORS = 'clear_errors';
export const GET_EMAILS = 'get_emails';
export const GET_EMAILS_FAIL = 'get_emails_fail';
export const ERROR = 'err';

// set login and register messages action types
export const SET_MSG = 'set_msg';
export const CLEAR_MSG = 'clear_msg';
export const LOGIN_MSG = 'login_msg';
export const REGISTER_MSG = 'register_msg';

// search results action types
export const SEARCH_RESULTS = 'search_results';
export const SEARCH_RESULTS_FAIL = 'search_results_fail';
export const RESET_RESULTS = 'reset_results';

// request action types
export const SEND_REQUEST = 'send_request';
export const SEND_REQUEST_FAIL = 'send_request_fail';
export const REQUEST_RECIEVED = 'request_recieved';
export const REQUEST_SENT = 'request_sent';
export const REQUEST_ACCEPTED = 'request_accepted';
export const REQUEST_REJECTED = 'request_rejected';
export const CANCEL_REQUEST = 'cancel_request';
export const RESET_REQUESTS = 'reset_requests';

// post action types
export const GET_POST = 'get_post';
export const CREATE_POST = 'create_post';
export const LIKE_POST = 'like_post';
export const UNLIKE_POST = 'unlike_post';
export const COMMENT_POST = 'comment_post';
export const POST_LOADING = 'post_loading';
export const COMMENT_LOADING = 'comment_loading';
export const COMMENT_LOADED = 'comment_loaded';
export const RESET_POSTS = 'reset_posts';
export const DELETE_POST = 'delete_post';
export const EDIT_POST = 'edit_post';
export const SHARE_POST = 'share_post';
export const LOAD_POST = 'load_post';
export const UPDATE_STATS = 'update_stats';
export const SELECTED_POST = 'selected_post';
export const DESTROY_POST = 'destroy_post';

export const PASSWORD_RESET_ERROR = 'password_reset_error';
export const VISITED_USER = 'visited_user';
export const LOADING = 'loading';
export const UPDATE_PROFILE = 'update_profile';

// loading action types
export const SHARING = 'sharing';
export const POSTING = 'posting';
export const DELETING = 'deleting';

// notificaion action types
export const GET_NOTIFICATION = 'get_notification';
export const OPEN_NOTIFICATION = 'open_notification';

// messages action types
export const CREATE_MESSAGE = 'create_message';
export const GET_MESSAGES = 'get_messages';
export const GET_CHATS = 'get_chats';
export const CHAT_LOADING = 'chat_loading';
export const SELECTED_CHAT_LOADING = 'selected_chat_loading';
