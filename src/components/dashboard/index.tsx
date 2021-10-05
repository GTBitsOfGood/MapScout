import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { withFirestore, isEmpty } from 'react-redux-firebase';
import { formRoute } from '../../routes/pathnames';
import SingleProvider from './SingleProvider';
import { selectItem } from '../../functions/reduxActions';
import CSV from './CSV';
import { DashTutorial } from './DashTutorial';

function Dashboard({ firestore, team, selectItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);

  async function fetchData() {
    if (team && team.name) {
      const collections = firestore.collection('categories');
      const c = await collections
        .where('team', '==', team.name)
        .get()
        .then((querySnapshot) => {
          const arr = [];
          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            arr.push(docData);
          });
          return arr;
        });
      const collections2 = firestore.collection('providers');
      const p = await collections2
        .where('team', '==', team.name)
        .get()
        .then((querySnapshot) => {
          const arr = [];
          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            arr.push(docData);
          });
          return arr;
        });
      setProviders(p);
      setCategories(c);
    }
  }

  useEffect(() => {
    fetchData().then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  return (

    <div className="admin-dashboard">
      <DashTutorial />
      <div className="admin-list-container">
        <div className="list-wrapper">
          <div className="add-export-bttns-wrapper">
            <div className="add-button-wrapper">
              <Button
                block
                variant="primary"
                onClick={() => selectItem({})}
                as={Link}
                to={formRoute}
              >
                + Add New Provider
              </Button>
            </div>
            <div className="export-button-wrapper">
              <CSV providers={providers} categories={categories}/>
            </div>
          </div>
          <div
            className="scroll-container"
            style={{ maxHeight: 'calc(100vh - 66px)' }}
          >
            <ListGroup variant="flush">
              {
                  !isEmpty(providers)
                  && providers.map((item, index) => (
                    <ListGroup.Item
                      href={item.id}
                      key={index}
                      className="point"
                      onClick={() => setSelectedIndex(index)}
                      active={selectedIndex === index}
                    >
                      <h2>{item.facilityName}</h2>
                    </ListGroup.Item>
                  ))
              }
            </ListGroup>
          </div>
        </div>
      </div>
      <div className="admin-provider">
        {
                providers && providers[selectedIndex]
                && (
                <SingleProvider
                  item={providers[selectedIndex]}
                  categories={categories}
                  editProvider={() => selectItem(providers[selectedIndex])}
                  setLoading={() => setIsLoading(true)}
                  resetIndex={() => {
                    setSelectedIndex(0);
                    setIsLoading(false);
                  }}
                />
                )
            }
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  selectItem,
};

const mapStateToProps = (state) => ({
  firebase: state.firebase,
  team: state.item.team,
});

export default compose<any>(
  withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Dashboard);