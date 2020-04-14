import React from 'react';
import { Icon } from 'semantic-ui-react';

/**
 * MAIN COMPONENT
 * - responsible for displaying head of modal
 */
const ModalHead = (props) => {
  return (
    <div className="modal-head">
      <h3>{props.heading}</h3>
      <Icon
        name="times"
        onClick={(e) => {
          e.stopPropagation();
          props.cb(false);
        }}
      />
    </div>
  );
};

export default ModalHead;
