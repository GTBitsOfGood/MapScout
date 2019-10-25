import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React, {Component, Fragment} from 'react';
import { withFirebase } from 'react-redux-firebase';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import {formRoute, providerRoute} from "./ProviderRoutes";
import Button from "react-bootstrap/Button";
import SingleProvider from "./SingleProvider";
var classNames = require('classnames');


class Dashboard extends Component {
    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedIndex: 0,
            isLoading: true
        };
    }


    getFirebase = async () => {
        var providers = [];

        await this.context.store.firestore.get("providers").then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    var dataMap = {};
                    dataMap = doc.data();
                    dataMap['provider'] = doc.id;
                    var keys = Object.keys(dataMap);
                    for(const key of keys) {
                        if (dataMap[key].constructor === Array) {
                            var arrData = dataMap[key];
                            dataMap[key] = dataMap[key].join(', ')
                        }
                    }
                    providers.push(dataMap)
                });
            });
        this.props.dispatch({ type: 'UPDATE_DATA', payload:  providers})
        this.setState({data: providers})
    };


    async componentDidMount(){
        if (!this.context.store.getState().firestoreData.retreived) {
            console.log('retreive new data')
            this.getFirebase()
        } else {
            console.log('data stored in global state')
            this.setState({data: this.context.store.getState().firestoreData.data})
        }
        this.setState({isLoading: false})
    }

    render() {
        const { isLoading, data, selectedIndex } = this.state;

        const columns = [{
            Header: 'Providers',
            accessor: 'provider',
        }, {
            Header: 'Address',
            accessor: 'address',
        },{
            Header: 'Ages',
            accessor: 'ages',
        },
        ];

        if (isLoading)
            return <div style={{ width: '100%' }}>
                <div className="spinner" />
        </div>;

        return (
            <Fragment>
                <Row noGutters>
                    <Col sm={3}>
                        <ListGroup variant="flush">
                            {
                                data.map((item, index) =>
                                    <ListGroup.Item
                                        href={item.provider}
                                        onClick={() => this.setState({selectedIndex: index})}
                                        active={selectedIndex === index}>
                                        {item.provider}
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                        <br />
                        <Button
                            block
                            variant="link"
                            as={Link}
                            to={formRoute}>
                            Add Provider
                        </Button>
                    </Col>
                    <Col sm={9}>
                        <div className="bg-white">
                            {
                                data && data[selectedIndex] &&
                                <SingleProvider item={data[selectedIndex]}/>
                            }
                        </div>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

export default connect((state) => ({
    firestore: state.firestore,
    firebase: state.firebase
}))(Dashboard)
