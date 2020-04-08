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
import NewNavBar from './NewNavBar';

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
        const { firestore, providers } = this.props;
        if ( !isLoaded(providers) ) {
            await firestore.get('providers')
            await firestore.get('categories')
        }
        this.setState({isLoading: false});
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  changeLanguageToFalse = async() => {
      console.log("hi")
      let firestore = this.props.firestore;
      console.log(firestore)
      await firestore.update({collection: 'categories', doc: 'languages'},{active: false})
      // await firestore.get({collection: 'providers', where: ['id', '==', item.id]}).then(function(querySnapshot) {
      //     querySnapshot.forEach(function(doc) {
      //         firestore.update({collection: 'providers', doc: doc.id}, item)
      //     });
      // });
  }
    
  render() {
    const { isLoading, data, selectedIndex } = this.state;
    const { providers } = this.props;

    if (isLoading && !isLoaded(providers)) {
      return (
        <div style={{ width: '100%' }}>
          <div className="spinner" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className = "admin-dashboard">
          <NewNavBar/>
          <div className="list-wrapper">
              <div className="fixed-container">
                <Button
                  block
                  variant="primary"
                  onClick={() => this.props.selectItem({})}
                  as={Link}
                  to={formRoute}
                >
                    +Add New Provider
                </Button>
              </div>
            <div className="scroll-container">
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
          <div
              className="scroll-container"
              style={{ maxHeight: 'calc(100vh - 10px)' }}
            >
              <div className="admin-provider">
                {
                                    providers && providers[selectedIndex]
                                    && (
                                    <SingleProvider
                                      item={providers[selectedIndex]}
                                      editProvider={() => this.props.selectItem(providers[selectedIndex])}
                                      setLoading={() => this.setState({ isLoading: true })}
                                      resetIndex={() => this.setState({ selectedIndex: 0, isLoading: false })}
                                    />
                                    )
                                }
              </div>
            </div>
        </div>
        {/* <Row noGutters>
            <NewNavBar/>
          <Col sm={3}>
            <div className="list-wrapper">
              <div className="fixed-container">
                <Button
                  block
                  variant="primary"
                  onClick={() => this.props.selectItem({})}
                  as={Link}
                  to={formRoute}
                >
                    +Add New Provider
                </Button>
              </div>
            <div className="scroll-container">
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
          </Col>
          <Col>
            <div
              className="scroll-container"
              style={{ maxHeight: 'calc(100vh - 64px)' }}
            >
              <div className="admin-provider">
                {
                                    providers && providers[selectedIndex]
                                    && (
                                    <SingleProvider
                                      item={providers[selectedIndex]}
                                      editProvider={() => this.props.selectItem(providers[selectedIndex])}
                                      setLoading={() => this.setState({ isLoading: true })}
                                      resetIndex={() => this.setState({ selectedIndex: 0, isLoading: false })}
                                    />
                                    )
                                }
              </div>
            </div>
          </Col>
        </Row> */}
      </React.Fragment>
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
