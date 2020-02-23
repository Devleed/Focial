import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Container } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import Navbar from './Navbar';
import { RESET_RESULTS } from '../helpers/actionTypes';

const SearchResults = () => {
  const results = useSelector(({ searchResults }) => searchResults);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch({ type: RESET_RESULTS });
    };
  }, []);

  const displayResults = () => {
    return results.map(result => {
      return (
        <List.Item key={result._id}>
          <List.Content>
            <NavLink style={{ color: 'black' }} to={`/user/${result._id}`}>
              {result.name}
            </NavLink>
          </List.Content>
        </List.Item>
      );
    });
  };
  return (
    <div>
      <Navbar />
      <Container style={{ marginTop: '70px', width: '60%' }}>
        <List verticalAlign="middle">{displayResults()}</List>
      </Container>
    </div>
  );
};

export default SearchResults;
