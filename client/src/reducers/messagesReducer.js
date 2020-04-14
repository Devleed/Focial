import {
  CREATE_MESSAGE,
  GET_MESSAGES,
  GET_CHATS,
  DESTROY_MESSAGES,
} from '../helpers/actionTypes';
import moment from 'moment';

const INITIAL_STATE = {
  chats: [],
  selectedChat: {
    messagesByDate: [],
    user: null,
  },
  chatsLoading: null,
  selectedChatLoading: null,
};

const getMessagesByDate = (messagesByDate, payload) => {
  let date = moment(payload.date).format('L').replace(/\//g, '-');
  let noChange = 0;
  messagesByDate = messagesByDate.map((msg) => {
    if (msg.date.replace(/\//g, '-') === date) {
      return {
        ...msg,
        messages: [...msg.messages, payload],
      };
    } else {
      noChange++;
      return msg;
    }
  });
  if (noChange === messagesByDate.length)
    return [...messagesByDate, { date, messages: [payload] }];
  return messagesByDate;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHATS:
      return {
        ...state,
        chats: action.payload,
      };
    case CREATE_MESSAGE:
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (
            chat.user._id === action.payload.sentBy ||
            state.selectedChat.user._id === chat.user._id
          ) {
            return { ...chat, message: action.payload };
          }
          return chat;
        }),
        selectedChat: {
          ...state.selectedChat,
          messagesByDate: getMessagesByDate(
            state.selectedChat.messagesByDate,
            action.payload
          ),
        },
      };
    case GET_MESSAGES:
      return {
        ...state,
        chats:
          state.chats.filter(
            (chat) => chat.user._id === action.payload.user._id
          ).length === 0
            ? [
                ...state.chats,
                {
                  user: action.payload.user,
                  message: { body: '', date: Date.now() },
                },
              ]
            : state.chats,
        selectedChat: action.payload,
      };
    case DESTROY_MESSAGES:
      return {
        ...state,
        selectedChat: INITIAL_STATE.selectedChat,
      };
    default:
      return state;
  }
};
