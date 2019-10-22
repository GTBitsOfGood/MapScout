import React, {Component, Fragment} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GoogleSuggest from "./GoogleSuggest";
import TimeTable from "./TimeTable";
import MultiInput from './MultiInput';

const RowForm = (props) => {
    switch (props.step) {
        case 0:
            return(
                <Fragment>
                    <Form.Group>
                        <Form.Label>Facility Name *</Form.Label>
                        <Form.Control placeholder="Name" />
                    </Form.Group>
                    <Row>
                        <Col xs={9}>
                            <GoogleSuggest />
                        </Col>
                        <Col xs={3}>
                            <Form.Group>
                                <Form.Label>Apt #</Form.Label>
                                <Form.Control placeholder="789" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label>Phone Number *</Form.Label>
                        <Form.Control placeholder="(000) 000-0000" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Website</Form.Label>
                        <Form.Control placeholder="www.health.com" />
                    </Form.Group>
                </Fragment>
            );
        case 1:
            return <TimeTable/>;
        case 2:
            return(
                <Fragment>
                    <Form.Group>
                        <Form.Label>Service Type</Form.Label>
                        <MultiInput />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Specializations</Form.Label>
                        <MultiInput />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Types of Therapy</Form.Label>
                        <MultiInput />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>EPIC Designation</Form.Label>
                        <MultiInput />
                    </Form.Group>
                </Fragment>
            );
        case 3:
            return(
                <Fragment>
                    <Form.Group>
                        <Form.Label>Provided Language(s)</Form.Label>
                        <MultiInput />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Accepted Age(s)</Form.Label>
                        <MultiInput />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check type="checkbox" label="Childcare Availability" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Accepted Insurance(s)</Form.Label>
                        <MultiInput />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Additional Note(s)</Form.Label>
                        <Form.Control as="textarea" rows="3" />
                    </Form.Group>
                </Fragment>
            );
        default:
            return;
    }
};

export default RowForm;
