import React from 'react';
import ModalHead from './ModalHead';

/**
 * MAIN COMPONENT
 * - responsible for displaying modal message
 */
const ModalMessage = ({ heading, message, cb, buttonText, buttonFunction }) => {
  return (
    <div className="modal-content-msg">
      <ModalHead heading={heading} cb={cb} />
      <div className="modal-msg">
        <p>{message}</p>
      </div>
      <div className="modal-msg-bottom">
        <button onClick={buttonFunction}>{buttonText}</button>
      </div>
    </div>
  );
};

export default ModalMessage;
