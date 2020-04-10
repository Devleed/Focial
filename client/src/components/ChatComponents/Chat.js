import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';

import Modal from '../HomeComponents/Modal';
import Navbar from '../Navbar';
import '../../styles/chat.css';
import { Redirect } from 'react-router-dom';
import ChatList from './ChatList';
import MessageList from './MessageList';
import ChatInfo from './ChatInfo';
import { PRIVATE_MESSAGE } from '../../helpers/socketTypes';
import { CREATE_MESSAGE } from '../../helpers/actionTypes';

const Chat = (props) => {
  const socket = useSelector(({ auth }) => auth.socket);
  const user = useSelector(({ auth }) => auth.user);
  const [showMessages, setShowMessages] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(PRIVATE_MESSAGE, (message) => {
      dispatch({ type: CREATE_MESSAGE, payload: message });
    });
  }, [dispatch]);

  useEffect(() => {
    const { user } = queryString.parse(props.location.search);
    setShowMessages(user);
  }, [props.location.search]);

  const searchFriends = (e) => {
    setValue(e.target.value);
    if (e.target.value === '') setResults([]);
    else {
      let results = user.friends
        .filter((friend) => friend.name.includes(e.target.value))
        .sort((a, b) => {
          a = a.name.indexOf(e.target.value);
          b = b.name.indexOf(e.target.value);
          if (a !== -1 && b !== -1) {
            return a - b;
          }
        })
        .slice(0, 5);
      setResults(results);
    }
  };

  const setChat = (id) => {
    setValue('');
    setShowMessages(id);
    setShowModal(false);
  };

  const renderResults = () => {
    console.log(results);
    return results.map((result) => {
      return (
        <li key={result._id} onClick={() => setChat(result._id)}>
          <img src={result.profile_picture} />
          <span>{result.name}</span>
        </li>
      );
    });
  };

  if (!user) return <Redirect to={{ path: '/auth' }} />;
  return (
    <React.Fragment>
      <Modal show={showModal} setShowModal={setShowModal}>
        <div className="modal-user-search" onClick={(e) => e.stopPropagation()}>
          <input
            placeholder="Search Friends"
            onChange={searchFriends}
            value={value}
            onClick={(e) => e.stopPropagation()}
          />
          {results.length > 0 ? (
            <div
              className="user-msg-results"
              onClick={(e) => e.stopPropagation()}
            >
              {renderResults()}
            </div>
          ) : null}
        </div>
      </Modal>
      <Navbar />
      <div className="message-container">
        <ChatList function={setShowModal} history={props.history} />
        <MessageList id={showMessages} />
        <ChatInfo />
      </div>
    </React.Fragment>
  );
};

export default Chat;
