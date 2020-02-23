import React from 'react';

const FieldFileInput = props => {
  const onChange = e => {
    const {
      input: { onChange }
    } = props;
    onChange(e.target.files[0]);
  };

  return (
    <input
      onClick={e => e.stopPropagation()}
      type="file"
      accept=".jpg, .png, .jpeg"
      onChange={onChange}
    />
  );
};

export default FieldFileInput;
