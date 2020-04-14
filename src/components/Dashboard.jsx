import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { withFirestore, isEmpty, isLoaded } from 'react-redux-firebase';
import { formRoute, providerRoute } from './ProviderRoutes';
import SingleProvider from './SingleProvider';
import NavBar from './NavBar';

const classNames = require('classnames');

export const SELECT_ITEM = 'SELECT_ITEM';

export function selectItem(data) {
  return function (dispatch) {
    dispatch({
      type: SELECT_ITEM,
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
            isLoading: true
        };
        this.changeLanguageToFalse = this.changeLanguageToFalse.bind(this);
    }

    async componentDidMount(){
        const { firestore, providers, categories } = this.props;
        if ( !isLoaded(providers) ) {
            await firestore.get('providers');
        }
        if ( !isLoaded(categories) ) {
            await firestore.get('categories')
        }
        this.setState({isLoading: false});
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  changeLanguageToFalse = async() => {
      let firestore = this.props.firestore;
      await firestore.update({collection: 'categories', doc: 'languages'},{active: false})
      // await firestore.get({collection: 'providers', where: ['id', '==', item.id]}).then(function(querySnapshot) {
      //     querySnapshot.forEach(function(doc) {
      //         firestore.update({collection: 'providers', doc: doc.id}, item)
      //     });
      // });
  }

  render() {
    const { isLoading, data, selectedIndex } = this.state;
    const { providers, categories } = this.props;

    if (isLoading && !isLoaded(providers)) {
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
    providers: state.firestore.ordered.providers,
    firebase: state.firebase,
    categories: state.firestore.ordered.categories,
});

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Dashboard);
