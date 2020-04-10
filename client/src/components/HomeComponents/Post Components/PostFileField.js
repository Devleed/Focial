import React from 'react';

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
      <label onClick={e => e.stopPropagation()} htmlFor="file">
        <span>
          <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/6C1aT2Hm3x-.png" />
          <p>Photo / video</p>
        </span>
      </label>
    </React.Fragment>
  );
};

export default FieldFileInput;
