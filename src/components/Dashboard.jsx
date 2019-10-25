<<<<<<< HEAD
import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

=======
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
>>>>>>> develop


class Dashboard extends Component {
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
        await this.props.firebase
            .firestore()
            .collection("providers").get().then(function(querySnapshot) {
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
        this.setState({providers: providers})

    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    }


    async componentDidMount(){
        this.getFirebase();
        const { firestore } = this.context.store
        firestore.get('providers').then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.data())
            })
        })

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
