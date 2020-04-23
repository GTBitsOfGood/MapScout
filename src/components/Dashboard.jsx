import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component, Fragment } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { withFirestore, isEmpty, isLoaded } from 'react-redux-firebase';
import { formRoute, providerRoute } from './ProviderRoutes';
import SingleProvider from './SingleProvider';
import API_KEY from "../config/keys";

const classNames = require('classnames');

export const SELECT_ITEM = 'SELECT_ITEM';
export const SELECT_TEAM = 'SELECT_TEAM';

export function selectItem(data) {
  return function (dispatch) {
    dispatch({
      type: SELECT_ITEM,
      data,
    });
  };
}

export function selectTeam(data) {
    return function (dispatch) {
        dispatch({
            type: SELECT_TEAM,
            data,
        });
    };
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedIndex: 0,
            isLoading: true,
            providers: [],
            categories: [],
        };
    }

    async componentDidMount(){
        const { firestore, team, firebase } = this.props;
        if (team === "pacts" || team === "ebp") {
            const collections = firestore.collection("categories");
            const categories = await collections
                .where('team', '==', team)
                .get()
                .then((querySnapshot) => {
                    const arr = [];
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        arr.push(docData);
                    });
                    return arr;
                });
            const collections2 = firestore.collection("providers");
            const providers = await collections2
                .where('team', '==', team)
                .get()
                .then((querySnapshot) => {
                    const arr = [];
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        arr.push(docData);
                    });
                    return arr;
                });
            this.setState({providers, categories, isLoading: false});
        }
  }

  render() {
    const { isLoading, data, selectedIndex } = this.state;
    const { providers, categories } = this.state;

    if (isLoading) {
      return (<div className="spinner-wrap">
          <div className="spinner" />
        </div>
      );
    }

    return (
      <div className = "admin-dashboard">
        <div className="admin-list-container">
          <div className="list-wrapper">
            <div className="add-button-wrapper">
                <Button
                    block
                    variant="primary"
                    onClick={() => this.props.selectItem({})}
                    as={Link}
                    to={formRoute}
                >
                    + Add New Provider
                </Button>
            </div>
            <div
                className="scroll-container"
                style={{ maxHeight: 'calc(100vh - 66px)' }}>
                <ListGroup variant="flush">
                    {
                        !isEmpty(providers) &&
                        providers.map((item, index) =>
                            <ListGroup.Item
                                href={item.id}
                                key={index}
                                className="point"
                                onClick={() => this.setState({selectedIndex: index})}
                                active={selectedIndex === index}>
                                  <h2>{item.facilityName}</h2>
                            </ListGroup.Item>
                        )
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
                    editProvider={() => this.props.selectItem(providers[selectedIndex])}
                    setLoading={() => this.setState({ isLoading: true })}
                    resetIndex={() => this.setState({ selectedIndex: 0, isLoading: false })}
                  />
                  )
              }
          </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  selectItem,
};

const mapStateToProps = (state) => ({
    firebase: state.firebase,
    team: state.item.team,
});

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Dashboard);
