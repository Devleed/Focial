import React, { useState, useRef } from 'react';

const ControlledTextarea = ({ value, setValue, submit, placeholder }) => {
  const [scrollHeight, setScrollHeight] = useState(34);
  const [overflow, setOverflow] = useState('hidden');
  let [rows, setRows] = useState(1);
  const textRef = useRef(null);

  return (
    <textarea
      style={{ overflow }}
      ref={textRef}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        if (scrollHeight < textRef.current.scrollHeight) {
          setScrollHeight(textRef.current.scrollHeight);
          console.log(rows);
          if (rows === 5 && overflow === 'hidden') {
            setOverflow('auto');
          } else if (rows < 5) {
            setRows(++rows);
          }
        }
        if (e.target.value === '') setRows(1);
      }}
      onKeyDown={(e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          submit(e);
          setRows(1);
        }
      }}
      rows={rows}
      placeholder={placeholder}
    ></textarea>
  );
};

export default ControlledTextarea;
