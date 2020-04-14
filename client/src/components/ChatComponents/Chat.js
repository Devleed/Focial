import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';

import Modal from '../HomeComponents/Modal';
import Navbar from '../Navbar';
import '../../styles/chat.css';
import { Redirect } from 'react-router-dom';
import ChatList from './ChatList';
import MessageList from './MessageList';
import ChatInfo from './ChatInfo';

/**
 * MAIN COMPONENT
 * - responsible for managing chat actions
 */
const Chat = (props) => {
  const user = useSelector(({ auth }) => auth.user);
  // using state to manage messages
  const [showMessages, setShowMessages] = useState(null);
  // using state to manage modal
  const [showModal, setShowModal] = useState(null);
  // using state to manage value
  const [value, setValue] = useState('');
  // using state to manage results
  const [results, setResults] = useState([]);

  // on mount
  useEffect(() => {
    // getting id from query
    const { user } = queryString.parse(props.location.search);
    setShowMessages(user);
  }, [props.location.search]);

  // function to perform searching of a friend ontype
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

  // function to set chat active of given id
  const setChat = (id) => {
    setValue('');
    setShowMessages(id);
    setShowModal(false);
  };

  // function to render results
  const renderResults = () => {
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
        <MessageList id={showMessages}>
          <h2>Messages</h2>
        </MessageList>
        <ChatInfo />
      </div>
    </React.Fragment>
  );
};

export default Chat;
