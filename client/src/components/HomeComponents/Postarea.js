import React from 'react';

import Createpost from './Post Components/Createpost';
import Posts from './Post Components/Posts';

const Postarea = () => {
  return (
    <div className="post_area">
      <Createpost />
      <Posts />
    </div>
  );
};

export default Postarea;
