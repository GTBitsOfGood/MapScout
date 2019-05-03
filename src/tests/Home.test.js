import React from 'react';
import Home from '../components/Index';
import renderer from 'react-test-renderer';

it('renders', () => {
  const tree = renderer
    .create(<Home/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
