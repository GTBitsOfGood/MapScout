import { connect } from 'react-redux';
import { compose } from "redux";
import React, {Component, Fragment} from 'react';
import Steps, {Step} from "rc-steps";
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import {Link} from "react-router-dom";
import {providerRoute} from "./ProviderRoutes";
import RowForm from "./RowForm";
import {Flipper, Flipped} from "react-flip-toolkit";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { withFirestore } from "react-redux-firebase";
import { isValidNumberForRegion, parseIncompletePhoneNumber } from 'libphonenumber-js'
import promiseWithTimeout from '../utils/PromiseWithTimeout';
import API_KEY from '../config/keys';

const steps = [
    "Map", "Hours", "Filters", "Descriptions", "Categories"
];

class AddProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            step: 0,
            completed: false,
            animate: true,
            item: this.props.selected || {},
            isLoading: false,
            filters: {},
            descriptions: {},
            categories: {},
            error: ''
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    async componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        const collections = this.props.firestore.collection('categories');
        const filters = await collections
            .where("team", "==", this.props.team)
            .where('active', '==', true)
            .where('select_type', '==', 2)
            .get()
            .then((querySnapshot) => {
                const idToData = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    idToData[doc.id] = {
                        name: data.name,
                        options: data.options
                    };
                });
                return idToData;
            });
        const descriptions = await collections
            .where("team", "==", this.props.team)
            .where('active', '==', true)
            .where('select_type', '==', 0)
            .get()
            .then((querySnapshot) => {
                const idToData = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    idToData[doc.id] = {
                        name: data.name,
                        options: data.options
                    };
                });
                return idToData;
            });
        const categories = await collections
            .where("team", "==", this.props.team)
            .where('active', '==', true)
            .where('select_type', '==', 1)
            .get()
            .then((querySnapshot) => {
                const idToData = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    idToData[doc.id] = {
                        name: data.name,
                        options: data.options
                    };
                });
                return idToData;
            });
        this.setState({ filters, descriptions, categories });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth });
    }

    setValue = (e) => {
        let item = this.state.item;
        item[e.target.name] = e.target.value;
        this.setState({item})
    };

    addFirestore = async () => {
        this.setState({isLoading: true});
        let item = {
            ...this.state.item,
            team: this.props.team,
            latitude: null,
            longitude: null,
        };

        try {
            if (this.state.item.address[0] && this.state.item.address[0].length > 0) {
                let response = await promiseWithTimeout(5000, fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${
                    this.state.item.address[0].replace(/\s/g, '%20')
                }&key=${API_KEY}`));
                let responseJson = await response.json();
                if (responseJson.results.length > 0 && responseJson.results[0].geometry.location) {
                    item.latitude = responseJson.results[0].geometry.location.lat;
                    item.longitude = responseJson.results[0].geometry.location.lng;
                }
            }
            await promiseWithTimeout(5000, this.props.firestore.set({collection: 'providers', doc: this.state.item['facilityName']}, item));
            this.props.history.push(providerRoute);
        } catch (e) {
            this.setState({ error: 'Failed to save changes. Please check your network connection or try again later.'});
        } finally {
            this.setState({ isLoading: false });
        }
    };

    updateFirestore = async () => {
        this.setState({isLoading: true});
        let item = {
            ...this.state.item,
            latitude: null,
            longitude: null,
        };

        try {
            if (this.state.item.address[0] && this.state.item.address[0].length > 0) {
                let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${
                    this.state.item.address[0].replace(/\s/g, '%20')
                }&key=${API_KEY}`);
                let responseJson = await response.json();
                if (responseJson.results.length > 0 && responseJson.results[0].geometry.location) {
                    item.latitude = responseJson.results[0].geometry.location.lat;
                    item.longitude = responseJson.results[0].geometry.location.lng;
                }
            }
            let firestore = this.props.firestore;
            //here the item.id needs to be added to the google firebase console
            await firestore.get({collection: 'providers', where: ['id', '==', item.id]}).then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    firestore.update({collection: 'providers', doc: doc.id}, item)
                });
            });
            await this.props.firestore.get('providers');
            this.props.history.push(providerRoute);
        } catch (e) {
            this.setState({ error: 'Failed to save changes. Please check your network connection or try again later.'});
        } finally {
            this.setState({isLoading: false});
        }
    };

    next = () => {
        this.setState({step: this.state.step += 1, animate: false});
        setTimeout(() => this.setState({animate: true}), 100);
    };

    prev = () => {
        this.setState({step: this.state.step -= 1, animate: false});
        setTimeout(() => this.setState({animate: true}), 100);
    };

    render() {
        const { width, step, completed, animate, isLoading, error } = this.state;

        if (isLoading)
        return <div className="spinner-wrap">
            <div className="spinner" />
        </div>;

        return (
            <div>
                {error && (
                    <Alert
                        variant="danger"
                        onClose={() => this.setState({ error: '' })}
                        dismissible
                    >
                        {error}
                    </Alert>
                )}

                <Row>
                    <Col xs={12} md={4} lg={3}>
                        <div className="step-wrapper">
                            <Steps current={step} direction={width > 768 ? "vertical" : "horizontal"} labelPlacement={width > 768 ? "horizontal" : "vertical"} >
                                <Step
                                    title="Map"/>
                                <Step
                                    title="Hours"/>
                                <Step
                                    title="Tag"/>
                                <Step
                                    title="Text"/>
                                <Step
                                    title="Toggle"/>
                            </Steps>
                            {width > 768 && (
                                <Fragment>
                                    <br />
                                    <Button
                                        block
                                        disabled={!completed}
                                        onClick={
                                            this.props.selected &&
                                            this.props.selected.facilityName
                                                ? this.updateFirestore
                                                : this.addFirestore
                                        }
                                    >
                                        {this.props.selected &&
                                        this.props.selected.facilityName
                                            ? "Edit"
                                            : "Add"}{" "}
                                        Provider
                                    </Button>
                                    <Button
                                        as={Link}
                                        to={providerRoute}
                                        variant="link"
                                        block
                                    >
                                        Cancel
                                    </Button>
                                </Fragment>
                            )}
                        </div>
                    </Col>
                    <Col xs={12} md={8} lg={9}>
                        <Flipper flipKey={step}>
                            <Flipped flipId='form'>
                            <div className="bg-white p-3">
                                <Flipped inverseFlipId='form' scale>
                                    <Form>
                                        <Row>
                                            <Col>
                                                <h2>{steps[step]} Info</h2>
                                            </Col>
                                            <Col xs="auto">
                                                <ButtonToolbar>
                                                    {
                                                        step > 0 &&
                                                        <Button onClick={this.prev} variant="link">Back</Button>
                                                    }
                                                    <Button
                                                        onClick={ step === 4 ? this.addFirestore : this.next}
                                                        disabled={ !completed && step === 4 }
                                                        variant="primary">
                                                        {step === 4 ?
                                                            this.props.selected && this.props.selected.facilityName
                                                                ? "Edit Provider"
                                                                : "Add Provider"
                                                            : "Next"}
                                                    </Button>
                                                </ButtonToolbar>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div>
                                            <div className={animate ? "fade-in" : "hide"}>
                                                <RowForm
                                                    step={step}
                                                    item={this.state.item}
                                                    setItem={(item) => {
                                                        let completed =
                                                            item.facilityName.length > 0
                                                            && isValidNumberForRegion(parseIncompletePhoneNumber(item.phoneNum[0]), "US");
                                                        this.setState({item, completed})
                                                    }}
                                                    filters={this.state.filters}
                                                    descriptions={this.state.descriptions}
                                                    categories={this.state.categories}
                                                />
                                            </div>
                                        </div>
                                    </Form>
                                </Flipped>
                            </div>
                            </Flipped>
                        </Flipper>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default compose(
    withFirestore,
    connect((state) => ({
        providers: state.firestore.ordered.providers,
        firebase: state.firebase,
        selected: state.item.selected,
        team: state.item.team,
    })))(AddProvider)
