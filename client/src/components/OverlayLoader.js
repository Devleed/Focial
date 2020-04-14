import React from 'react';
import Loader from './Loader';

/**
 * MAIN COMPONENT
 * - responsible for displaying overlay loader
 */
const OverlayLoader = () => {
  return (
    <div className="div-modal">
      <Loader />
    </div>
  );
};

export default OverlayLoader;
