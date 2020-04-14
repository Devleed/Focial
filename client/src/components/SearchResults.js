import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Navbar from './Navbar';
import { searchUser } from '../helpers';
import { RESET_RESULTS } from '../helpers/actionTypes';
import '../styles/searchResults.css';
import { Loader } from 'semantic-ui-react';
import ProfileCards from './ProfileCards';

/**
 * MAIN COMPONENT
 * - responsible for displaying and managing search results
 */
const SearchResults = (props) => {
  // select results from store
  const results = useSelector(({ searchResults }) => searchResults);
  // select logged in user
  const loggedInUser = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();
  // using state to manage loading state
  const [loading, setLoading] = useState(null);

  // let _unmounted;

  // on mount
  useEffect(() => {
    (() => {
      // _unmounted = false;
      // if (!_unmounted) setLoading(true);
      dispatch(searchUser(props.match.params.term, setLoading));
    })();
    return () => {
      // _unmounted = true;
      dispatch({ type: RESET_RESULTS });
    };
  }, [dispatch, props.match.params.term]);

  // function to get mutual friends
  const getMutualFriends = (friends) => {
    let mutualFriends = 0;
    friends.forEach((friend) => {
      if (loggedInUser.friends.includes(friend)) mutualFriends++;
    });
    return mutualFriends;
  };

  // function to display results
  const displayResults = () => {
    return results.map((result, i) => {
      return (
        <ProfileCards
          key={i}
          user={result}
          mutualFriends={getMutualFriends(result.friends)}
          className="search_result-div"
        />
      );
    });
  };

  if (!loggedInUser) return <Redirect to={{ pathname: '/auth' }} />;
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
