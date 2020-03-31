import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

import '../styles/loadingIndicator.css';

const LoadingIndicator = props => {
  const loading = useSelector(({ loading }) => loading);
  if (loading.loading || props.loading)
    return ReactDOM.createPortal(
      <div className={`loading_indicator`}>
        <Loader />
        <div>{loading.key}</div>
      </div>,
      document.getElementById('loading')
    );
  else return null;
};

export default LoadingIndicator;
