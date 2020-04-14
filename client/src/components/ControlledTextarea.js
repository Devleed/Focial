import React, { useState, useRef } from 'react';

/**
 * MAIN COMPONENT
 * - responsible for displaying a textarea which is fully controlled
 */
const ControlledTextarea = ({ value, setValue, submit, placeholder }) => {
  // using state to store scroll height value
  // to know if user has reached second line of textarea
  const [scrollHeight, setScrollHeight] = useState(34);
  // using state to set overflow if more than 5 rows are already used
  const [overflow, setOverflow] = useState('hidden');
  // using state to set rows
  let [rows, setRows] = useState(1);
  // using reference to get the scroll height
  const textRef = useRef(null);

  return (
    <textarea
      style={{ overflow }}
      ref={textRef}
      value={value}
      onChange={(e) => {
        // set value when user types something
        setValue(e.target.value);
        // if user has reached end of line
        if (scrollHeight < textRef.current.scrollHeight) {
          // set the scroll height
          setScrollHeight(textRef.current.scrollHeight);
          // if rows are equal to 5 and overflow is also hidden
          if (rows === 5 && overflow === 'hidden') {
            // set the overflow to auto
            setOverflow('auto');
          } else if (rows < 5) {
            // increment and set rows if they are less than 5
            setRows(++rows);
          }
        }
        // set rows back to one if textarea is empty
        if (e.target.value === '') setRows(1);
      }}
      onKeyDown={(e) => {
        // check which key is pressed
        if (e.keyCode === 13 && e.shiftKey === false) {
          // if it's enter key and shift is not helled down
          // then submit the form
          e.preventDefault();
          submit(e);
          // set the rows back to 1
          setRows(1);
        }
      }}
      rows={rows}
      placeholder={placeholder}
    ></textarea>
  );
};

export default ControlledTextarea;
