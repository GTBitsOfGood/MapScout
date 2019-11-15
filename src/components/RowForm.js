import React, {Component, Fragment} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GoogleSuggest from "./GoogleSuggest";
import TimeTable from "./TimeTable";
import {AsYouType, isValidNumberForRegion, parseIncompletePhoneNumber} from 'libphonenumber-js';
import options from "../utils/options";
import MultiSelect from "@khanacademy/react-multi-select";
import FileUploader from 'react-firebase-file-uploader'
import {storage} from '../store'

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

class RowForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            facilityName: '',
            address: [],
            ages: [],
            buildingNum: [],
            childcare: [false],
            epic: [false],
            hours: {},
            insurance: [],
            languages: [],
            notes: [],
            phoneNum: [],
            serviceType: [],
            specializations: [],
            therapyTypes: [],
            website: [],
            image: '',
            imageURL: ''
        };
    }

    handleInputChange = (e) => {
        if (e.target.type === "checkbox") {
            this.setState({[e.target.name]: [e.target.checked]});
        } else {
            this.setState({[e.target.name]: [e.target.value]});
        }
        setTimeout(() => this.props.setItem(this.state), 100);
    };

    onPhoneChange = (e) => {
        if (e.target.value.length === 4 && e.target.value[0] === "(") {
            this.setState({phoneNum: [e.target.value]});
        } else {
            this.setState({phoneNum: [new AsYouType('US').input(e.target.value)]});
        }
        setTimeout(() => this.props.setItem(this.state), 100);
    };

    onTimeChange = (hours) => {
        this.setState({ hours: {
            Monday: hours[0].selected ? [hours[0].start, hours[0].end] : null,
            Tuesday: hours[1].selected ? [hours[1].start, hours[1].end] : null,
            Wednesday: hours[2].selected ? [hours[2].start, hours[2].end] : null,
            Thursday: hours[3].selected ? [hours[3].start, hours[3].end] : null,
            Friday: hours[4].selected ? [hours[4].start, hours[4].end] : null,
            Saturday: hours[5].selected ? [hours[5].start, hours[5].end] : null,
            Sunday: hours[6].selected ? [hours[6].start, hours[6].end] : null,
        }});
        setTimeout(() => this.props.setItem(this.state), 100);
    };

    handleUploadSuccess = async filename => {
        await this.setState({ image: filename })
        await storage.ref('images').child(filename).getDownloadURL()
        .then(url => this.setState({
            imageURL: url
        }))
        setTimeout(() => this.props.setItem(this.state), 100);
    }

    render() {
        let item = this.state;

        switch (this.props.step) {
            case 0:
                return(
                    <Fragment>
                        <Form.Group>
                            <Form.Label>Facility Name *</Form.Label>
                            <Form.Control
                                name="facilityName"
                                value={item.facilityName}
                                onChange={(e) => {
                                    this.setState({[e.target.name]: e.target.value});
                                    setTimeout(() => this.props.setItem(this.state), 100);
                                }}
                                placeholder="Name" />
                        </Form.Group>
                        <Row>
                            <Col xs={9}>
                                <GoogleSuggest
                                    value={item.address[0]}
                                    update={(address)=> {
                                        this.setState({address: [address]});
                                        setTimeout(() => this.props.setItem(this.state), 100);
                                    }}
                                />
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>Apt #</Form.Label>
                                    <Form.Control
                                        name="buildingNum"
                                        value={item.buildingNum[0]}
                                        onChange={this.handleInputChange}
                                        placeholder="789" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label>Phone Number *</Form.Label>
                            <Form.Control
                                name="phoneNum"
                                value={item.phoneNum[0]}
                                onChange={this.onPhoneChange}
                                placeholder="(000) 000-0000" />
                            {
                                item.phoneNum.length > 0 &&
                                    <p>
                                        <small style={{ color:
                                                isValidNumberForRegion(parseIncompletePhoneNumber(item.phoneNum[0]), 'US')
                                                ? 'green' : 'red' }}>
                                            {
                                                isValidNumberForRegion(parseIncompletePhoneNumber(item.phoneNum[0]), 'US')
                                                    ? 'Valid number' : 'Invalid number'
                                            }
                                        </small>
                                    </p>
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                                name="website"
                                value={item.website[0]}
                                onChange={this.handleInputChange}
                                placeholder="www.health.com" />
                            {
                                item.website.length > 0 &&
                                <p>
                                    <small style={{ color:
                                            validURL(item.website[0])
                                                ? 'green' : 'red' }}>
                                        {
                                            validURL(item.website[0])
                                                ? 'Valid URL' : 'Invalid URL'
                                        }
                                    </small>
                                </p>
                            }
                        </Form.Group>
                    </Fragment>
                );
            case 1:
                return <TimeTable onChange={this.onTimeChange}/>;
            case 2:
                return(
                    <Fragment>
                        <Form.Group>
                            <Form.Label>Service Type</Form.Label>
                            <MultiSelect
                                options={options.serviceType}
                                selected={item.serviceType}
                                onSelectedChanged={(selected) => {
                                    this.setState({
                                        serviceType: selected
                                    });
                                    setTimeout(() => this.props.setItem(this.state), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Specializations</Form.Label>
                            <MultiSelect
                                options={options.specializations}
                                selected={item.specializations}
                                onSelectedChanged={(selected) => {
                                    this.setState({
                                        specializations: selected
                                    });
                                    setTimeout(() => this.props.setItem(this.state), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Types of Therapy</Form.Label>
                            <MultiSelect
                                options={options.therapyTypes}
                                selected={item.therapyTypes}
                                onSelectedChanged={(selected) => {
                                    this.setState({
                                        therapyTypes: selected
                                    });
                                    setTimeout(() => this.props.setItem(this.state), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                name="epic"
                                value={item.epic[0]}
                                onChange={this.handleInputChange}
                                type="checkbox"
                                label="EPIC Designation" />
                        </Form.Group>
                    </Fragment>
                );
            case 3:
                return(
                    <Fragment>
                        <Form.Group>
                            <Form.Label>Provided Language(s)</Form.Label>
                            <MultiSelect
                                options={options.languages}
                                selected={item.languages}
                                onSelectedChanged={(selected) => {
                                    this.setState({
                                        languages: selected
                                    });
                                    setTimeout(() => this.props.setItem(this.state), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Accepted Age(s)</Form.Label>
                            <MultiSelect
                                options={options.ages}
                                selected={item.ages}
                                onSelectedChanged={(selected) => {
                                    this.setState({
                                        ages: selected
                                    });
                                    setTimeout(() => this.props.setItem(this.state), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                name="childcare"
                                value={item.childcare[0]}
                                onChange={this.handleInputChange}
                                type="checkbox"
                                label="Childcare Availability" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Accepted Insurance(s)</Form.Label>
                            <MultiSelect
                                options={options.insurance}
                                selected={item.insurance}
                                onSelectedChanged={(selected) => {
                                    this.setState({
                                        insurance: selected
                                    });
                                    setTimeout(() => this.props.setItem(this.state), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Additional Note(s)</Form.Label>
                            <Form.Control
                                name="notes"
                                value={item.notes[0]}
                                onChange={this.handleInputChange}
                                as="textarea"
                                rows="3" />
                        </Form.Group>
                        <FileUploader
                            accept="image/*"
                            name='image'
                            storageRef={storage.ref('images')} 
                            onUploadSuccess={this.handleUploadSuccess}
                        >
                                
                        </FileUploader>
                    </Fragment>
                );
            default:
                return;
        }
    }
}

export default RowForm;
