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
import {Link} from "react-router-dom";
import {providerRoute} from "./ProviderRoutes";
import RowForm from "./RowForm";
import {Flipper, Flipped} from "react-flip-toolkit";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";

class AddProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            step: 0,
            completed: false,
            animate: true,
            item: {},
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    async componentDidMount() {
        if (this.props.item)
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
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
        await this.props.firestore.set({collection: 'providers', doc: this.state.item['facilityName']}, this.state.item);
        this.props.history.push(providerRoute)
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

        const { width, step, completed, animate } = this.state;

        return(
            <div>
                <Row>
                    <Col xs={12} md={4} lg={3}>
                        <div className="step-wrapper">
                            <Steps current={step} direction={width > 768 ? "vertical" : "horizontal"} labelPlacement={width > 768 ? "horizontal" : "vertical"} >
                                <Step
                                    title="Map"
                                    description="Description"/>
                                <Step
                                    title="Hours"
                                    description="Description"/>
                                <Step
                                    title="Service"
                                    description="Description"/>
                                <Step
                                    title="More"
                                    description="Description"/>
                            </Steps>
                            {
                                width > 768 &&
                                    <Fragment>
                                        <br />
                                        <Button block disabled={!completed} onClick={this.addFirestore}>
                                            Add Provider
                                        </Button>
                                        <Button as={Link} to={providerRoute} variant="link" block>Cancel</Button>
                                    </Fragment>
                            }
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
                                                <h2>Map Info</h2>
                                            </Col>
                                            <Col xs="auto">
                                                <ButtonToolbar>
                                                    {
                                                        step > 0 &&
                                                        <Button onClick={this.prev} variant="link">Back</Button>
                                                    }
                                                    <Button
                                                        onClick={ step === 3 ? this.addRow : this.next}
                                                        variant="primary">
                                                        {step === 3 ? "Add Provider" : "Next"}
                                                    </Button>
                                                </ButtonToolbar>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div className={animate ? "fade-in" : "hide"}>
                                            <RowForm
                                                step={step}
                                                item={this.state.item}
                                                setItem={(item) => {
                                                    let completed = item.facilityName && item.phoneNum.length > 0;
                                                    this.setState({item, completed})
                                                }}
                                            />
                                        </div>
                                    </Form>
                                </Flipped>
                            </div>
                            </Flipped>
                        </Flipper>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default compose(
    withFirestore,
    connect((state) => ({
        firebase: state.firebase,
        item: state.item
    })))(AddProvider)
