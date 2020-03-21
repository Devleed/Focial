import React from 'react';
import reactDOM from 'react-dom';

import '../../styles/modal.css';

const Modal = props => {
  if (props.show) document.body.style.overflow = 'hidden';
  else document.body.style.overflowY = 'scroll';

  if (!props.show) {
    return null;
  }

  return reactDOM.createPortal(
    <div
      className="modal"
      onClick={() => {
        props.setShowModal(false);
      }}
    >
      {props.children}
    </div>,
    document.getElementById('modal')
  );
};

export default Modal;
