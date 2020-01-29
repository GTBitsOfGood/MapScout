import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../components/Index';

it('renders', () => {
  const tree = renderer
    .create(<Home />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
