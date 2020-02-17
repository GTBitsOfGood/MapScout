import { connect } from 'react-redux';
import { compose } from "redux";
import React, {Component, Fragment} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import {formRoute, providerRoute} from "./ProviderRoutes";
import Button from "react-bootstrap/Button";
import SingleProvider from "./SingleProvider";
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
var classNames = require('classnames');

export const SELECT_ITEM = 'SELECT_ITEM';

export function selectItem(data) {
    return function (dispatch) {
        dispatch({
            type: SELECT_ITEM,
            data,
        })
    }
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedIndex: 0,
            isLoading: true
        };
    }

    async componentDidMount(){
        const { firestore, providers } = this.props;
        if ( !isLoaded(providers) ) {
            await firestore.get('providers')
        }
        this.setState({isLoading: false});
    }

    componentDidUpdate(){
        console.log(this.props);
    }

    render() {
        const { isLoading, data, selectedIndex } = this.state;
        const providers = this.props.providers;

        if (isLoading && !isLoaded(providers))
            return <div style={{ width: '100%' }}>
                <div className="spinner" />
        </div>;

        return (
            <Fragment>
                <Row noGutters>
                    <Col sm={3}>
                        <div className="list-wrapper">
                            <div className="fixed-container">
                                <Button
                                    block
                                    variant="primary"
                                    onClick={() => this.props.selectItem({})}
                                    as={Link}
                                    to={formRoute}>
                                    Add new provider
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
                                                <b>{item.facilityName}</b>
                                                <br />
                                                <small>{item.address[0]}</small>
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                            </div>
                        </div>
                    </Col>
                    <Col sm={9}>
                        <div className="scroll-container"
                            style={{ maxHeight: 'calc(100vh - 64px)' }}>
                            <div className="bg-white">
                                {
                                    providers && providers[selectedIndex] &&
                                    <SingleProvider item={providers[selectedIndex]}
                                                    editProvider={() => this.props.selectItem(providers[selectedIndex])}
                                                    setLoading={() => this.setState({isLoading: true})}
                                                    resetIndex={() => this.setState({selectedIndex: 0, isLoading: false})}/>
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    selectItem,
};

const mapStateToProps = (state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase,
});

export default compose(
    withFirestore,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ))(Dashboard)
