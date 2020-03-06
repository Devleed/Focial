import React from 'react';
import { Icon } from 'semantic-ui-react';

const FieldFileInput = props => {
  const onChange = e => {
    if (e.target.files && e.target.files[0]) {
      props.onFileSelect([...props.files, ...e.target.files]);
      let reader = new FileReader();
      reader.onload = e => {
        props.setPreview(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <React.Fragment>
      <input
        id="file"
        onClick={e => e.stopPropagation()}
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={onChange}
      />
      <label
        onClick={e => e.stopPropagation()}
        htmlFor="file"
        className="btn-2"
      >
        <Icon name="image" />
        Add Image
      </label>
    </React.Fragment>
  );
};

export default FieldFileInput;
