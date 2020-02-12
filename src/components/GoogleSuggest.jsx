import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import Form from 'react-bootstrap/Form';
import API_KEY from '../config/keys';

const GoogleSuggest = (props) => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(props.value);

  function handleInputChange(e) {
    setSearch(e.target.value);
    setValue(e.target.value);
    props.update(e.target.value);
  }

  function handleSelectSuggest(suggest) {
    setSearch('');
    setValue(suggest.description);
    props.update(suggest.description);
  }

  return (
    <ReactGoogleMapLoader
      params={{
        key: API_KEY,
        libraries: 'places,geocode',
      }}
      render={(googleMaps) => googleMaps && (
        <ReactGooglePlacesSuggest
          autocompletionRequest={{ input: search }}
          googleMaps={googleMaps}
                    // onSelectSuggest={handleSelectSuggest.bind(this)}
          customRender={(prediction) => (
            <div onClick={() => handleSelectSuggest(prediction)}>
              {prediction
                ? prediction.description
                : 'No results text'}
            </div>
          )}
        >
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              placeholder="123 Main St."
              value={value}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>
        </ReactGooglePlacesSuggest>
      )}
    />
  );
};

GoogleSuggest.propTypes = {
  googleMaps: PropTypes.object,
  update: PropTypes.func,
};

export default GoogleSuggest;
