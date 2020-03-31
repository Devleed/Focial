import React from 'react';
import ModalHead from './ModalHead';

const ModalMessage = ({
  heading,
  message,
  setShowModal,
  buttonText,
  buttonFunction
}) => {
  return (
    <div className="modal-content-msg">
      <ModalHead heading={heading} cb={setShowModal} />
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
