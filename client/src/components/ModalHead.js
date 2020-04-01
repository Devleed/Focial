import React from 'react';
import { Icon } from 'semantic-ui-react';

const ModalHead = props => {
  console.log(props.cb);
  return (
    <div className="modal-head">
      <h3>{props.heading}</h3>
      <Icon
        name="times"
        onClick={e => {
          e.stopPropagation();
          props.cb(false);
        }}
      />
    </div>
  );
};

export default ModalHead;
