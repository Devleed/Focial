import React from 'react';
import { NavLink } from 'react-router-dom';

const StillWorking = () => {
  return (
    <div className="still_working-text">
      <div>
        <h1>Woah! Hold on buddy</h1>
        <p>Still working on this feature</p>
        <NavLink to="/">Back to home</NavLink>
        <NavLink id="list" to="/about">
          List of features working ->
        </NavLink>
      </div>
    </div>
  );
};

export default StillWorking;
