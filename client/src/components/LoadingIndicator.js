import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import '../styles/loadingIndicator.css';

const loader = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

const LoadingIndicator = props => {
  const loading = useSelector(({ loading }) => loading);
  if (loading.loading || props.loading)
    return ReactDOM.createPortal(
      <div className={`loading_indicator`}>
        {loader()}
        <div>{loading.key}</div>
      </div>,
      document.getElementById('loading')
    );
  else return null;
};

export default LoadingIndicator;
