import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { withFirestore } from 'react-redux-firebase';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { Link } from 'react-router-dom';
import ProviderInfo from '../subcomponents/ProviderInfo';
import { formRoute } from '../navigation/ProviderRoutes';

// updateFirestore = async () => {
//     //Change 'ages' to the specific parameter to update
//     await this.props.firestore.update({collection: 'providers', doc: this.state.itemUpdates['facilityName']}, {'ages': '10'});
//     await this.props.firestore.get('providers')
// };

const SingleProvider = (props) => (
  <div>
    <div
      className="image-cover row-spaced mb-3"
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
              const collections = props.firestore.collection('providers');
              const filters = await collections
                .where('id', '==', props.item.id)
                .get()
                .then(async (querySnapshot) => {
                  await querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                  });
                });
              await props.firestore.get('providers');
              props.resetIndex();
            }}
          >
            Delete
          </Button>
        </ButtonToolbar>
      </div>
    </div>
    <div
      className="scroll-container"
      style={{ maxHeight: '100vh', top: '0', paddingTop: 20 }}
    >
      <Container>
        <ProviderInfo item={props.item} categories={props.categories} />
      </Container>
    </div>
  </div>
);

export default withFirestore(SingleProvider);
