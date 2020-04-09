import React, { Component, Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { compose } from 'redux';
import { withFirestore } from 'react-redux-firebase';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { Link } from 'react-router-dom';
import ProviderInfo from './ProviderInfo';
import { formRoute } from './ProviderRoutes';

// updateFirestore = async () => {
//     //Change 'ages' to the specific parameter to update
//     await this.props.firestore.update({collection: 'providers', doc: this.state.itemUpdates['facilityName']}, {'ages': '10'});
//     await this.props.firestore.get('providers')
// };

const SingleProvider = (props) => (
  <div>
    <div
      className="image-cover row-spaced mb-3"
      style={{
        background: 'linear-gradient(354.31deg, #4A537A 7.7%, #5C648D 98.05%)',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      paddingBottom: '20px'}}
    >
      <div>
        <ButtonToolbar>
          <Button
            onClick={props.editProvider}
            as={Link}
            to={formRoute}
            variant="info"
            className="mr-2"
          >
                    Edit
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              props.setLoading();
              await props.firestore.delete({ collection: 'providers', doc: props.item.facilityName });
              await props.firestore.get('providers');
              props.resetIndex();
            }}
          >
                    Delete
          </Button>
        </ButtonToolbar>
      </div>
    </div>
    <Container>
      <ProviderInfo item={props.item} />
    </Container>
  </div>
);

export default compose(withFirestore)(SingleProvider);
