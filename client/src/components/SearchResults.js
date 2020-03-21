import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';

import Navbar from './Navbar';
import { searchUser } from '../helpers';
import { RESET_RESULTS } from '../helpers/actionTypes';
import '../styles/searchResults.css';
import RequestButtons from './RequestButtons';
import { Loader } from 'semantic-ui-react';
import ProfileCards from './ProfileCards';

const SearchResults = props => {
  const results = useSelector(({ searchResults }) => searchResults);
  const loggedInUser = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null);

  let _unmounted;

  useEffect(() => {
    _unmounted = false;
    if (!_unmounted) setLoading(true);
    dispatch(searchUser(props.match.params.term, setLoading));
    return () => {
      _unmounted = true;
      dispatch({ type: RESET_RESULTS });
    };
  }, [dispatch, props.match.params.term]);

  const getMutualFriends = friends => {
    let mutualFriends = 0;
    friends.forEach(friend => {
      if (loggedInUser.friends.includes(friend)) mutualFriends++;
    });
    return mutualFriends;
  };

  const displayResults = () => {
    return results.map(result => {
      return (
        <ProfileCards
          user={result}
          mutualFriends={getMutualFriends(result.friends)}
          className="search_result-div"
        />
      );
    });
  };

  if (!loggedInUser) return <Redirect to={{ pathname: '/login' }} />;
  return (
    <div>
      <Navbar />
      {loading ? (
        <Loader active />
      ) : (
        <React.Fragment>
          <p className="search-text">
            Search results for '{props.match.params.term}'
          </p>
          <div className="search_results-info">{displayResults()}</div>
        </React.Fragment>
      )}
    </div>
  );
};

export default SearchResults;
