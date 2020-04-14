import React, { useState, useEffect, useRef } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Icon } from 'semantic-ui-react';
import { searchUser } from '../helpers';
import Loader from './Loader';

/**
 * MAIN COMPONENT
 * - responsible for displaying and managing search operations
 */
const Search = (props) => {
  const history = useHistory();
  // using state to manage value
  const [value, setValue] = useState('');
  // using state to manage laoding state
  const [loading, setLoading] = useState(null);
  // using state to manage when to show search results
  const [showResults, setShowResults] = useState(null);
  // selecting search results from store
  const results = useSelector(({ searchResults }) => searchResults);
  const dispatch = useDispatch();

  const unmounted = useRef(null);

  let elementNode;

  // on mount
  useEffect(() => {
    (() => {
      unmounted.current = false;
      document.addEventListener('mousedown', handleClick, false);
    })();
    return () => {
      unmounted.current = true;
      document.removeEventListener('mousedown', handleClick, false);
    };
  }, []);

  // function to perform when form is submitted
  const onFormSubmit = (e) => {
    e.preventDefault();
    setShowResults(false);
    let path = `/search/${value}`;
    history.push(path);
  };

  // function to perform when clicked
  const handleClick = (e) => {
    if (elementNode) {
      if (!elementNode.contains(e.target)) {
        setLoading(false);
      }
    }
  };

  // function to perform input is changed
  const onInputChange = async (e) => {
    if (!unmounted.current) {
      setLoading(true);
      setShowResults(true);
      if (e.target.value === '') {
        setLoading(false);
        setShowResults(false);
      }
      setValue(e.target.value);
      dispatch(searchUser(e.target.value, setLoading));
    }
  };

  // function to display search results
  const displaySearchResults = () => {
    if (loading) return <Loader />;
    if (results.length === 0) return <p>No results found</p>;
    return results.map((result) => {
      return (
        <NavLink to={`/user/${result._id}`} key={result._id}>
          {result.profile_picture ? (
            <div className="small-picture" style={{ marginRight: '10px' }}>
              <img src={result.profile_picture} />
            </div>
          ) : (
            <Icon name="user" />
          )}
          <p>{result.name}</p>
        </NavLink>
      );
    });
  };

  return (
    <div className="search-div" ref={(node) => (elementNode = node)}>
      {showResults ? (
        <div className="search_results">{displaySearchResults()}</div>
      ) : null}
      <form className="search_form" onSubmit={onFormSubmit}>
        <div className="search_field">
          <Icon name="search" style={{ margin: 0 }} />
          <input
            name="search-field"
            value={value}
            type="text"
            placeholder="search..."
            onChange={onInputChange}
            autoComplete="off"
          />
        </div>
      </form>
    </div>
  );
};

export default Search;
