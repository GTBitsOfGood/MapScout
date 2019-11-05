import React, {Component, Fragment} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GoogleSuggest from "./GoogleSuggest";
import TimeTable from "./TimeTable";
import { AsYouType } from 'libphonenumber-js'
import MultiSelect from "@khanacademy/react-multi-select";

//TODO: Move options outside of codebase
const options ={
    serviceType: [
        {label: 'Outpatient Services', value: 'Outpatient Services'},
        {label: 'Residential Programs', value: 'Residential Programs'},
        {label: 'Parent/Caregiver Services', value: 'Parent/Caregiver Services'},
        {label: 'School-Based Services', value: 'School-Based Services'},
        {label: 'Foster & Kinship Care', value: 'Foster & Kinship Care'},
        {label: 'In-Home Services', value: 'In-Home Services'},
    ],
    specializations: [
        {label: 'Autism Spectrum Disorder', value: 'Autism Spectrum Disorder'},
        {label: 'Young Children', value: 'Young Children'},
        {label: 'LGBTQ+ Competent', value: 'LGBTQ+ Competent'},
        {label: 'Experience working with immigrant and refugees', value: 'Experience working with immigrant and refugees'},
    ],
    ages: [
        {label: 'Toddler/preschoolers (0-6)', value: '0-6'},
        {label: 'Children (6-10)', value: '6-10'},
        {label: 'Preteens (11-13)', value: '11-13'},
        {label: 'Adolescents (14-21)', value: '14-21'},
        {label: 'Adults (21-65)', value: '21-65'},
        {label: 'Seniors (65+)', value: '65+'},
    ],
    insurance: [
        {label: 'Medicaid', value: 'Medicaid'},
        {label: 'Private', value: 'Private'},
        {label: 'Uninsured/Underinsured', value: 'Uninsured'},
        {label: 'Sliding Scale', value: 'Sliding Scale'},
    ],
    languages: [
        {label: 'Spanish', value: 'Spanish'},
        {label: 'Portuguese', value: 'Portuguese'},
        {label: 'Kurdish', value: 'Kurdish'},
        {label: 'Mandarin', value: 'Mandarin'},
        {label: 'Russian', value: 'Russian'},
        {label: 'ASL', value: 'ASL'},
        {label: 'Creole', value: 'Creole'},
        {label: 'Others', value: 'Others'},
    ],
    therapyTypes: [
        {label: 'TF-CBT (Trauma-Focused Cognitive Behavioral Therapy)', value: 'TF-CBT'},
        {label: 'Pri-CARE (Child Adult Relationship Enhancement)', value: 'Pri-CARE'},
        {label: 'CFTSI (Child Family Traumatic Stress Intervention)', value: 'CFTSI'},
        {label: 'Adolescent Dialectical Behavioral Therapy (DBT)', value: 'DBT'},
        {label: 'Family Therapy', value: 'Family Therapy'},
        {label: 'EMDR', value: 'EMDR'},
        {label: 'Other Evidence-Based Practices (EBPs)', value: 'EBPs'},
        {label: 'Support Groups', value: 'Support Groups'},
    ],
};

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
        };
    }

    handleInputChange = (e) => {
        if (e.target.type === "checkbox") {
            this.setState({[e.target.name]: [e.target.checked]});
        } else {
            this.setState({[e.target.name]: [e.target.value]});
        }
        this.props.setItem(this.state);
    };

    onPhoneChange = (e) => {
        if (e.target.value.length === 4 && e.target.value[0] === "(") {
            this.setState({phoneNum: e.target.value});
        } else {
            this.setState({phoneNum: new AsYouType('US').input(e.target.value)});
        }
        this.props.setItem(this.state);
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
        this.props.setItem(this.state);
    };

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
                                    this.props.setItem(this.state);
                                }}
                                placeholder="Name" />
                        </Form.Group>
                        <Row>
                            <Col xs={9}>
                                <GoogleSuggest
                                    value={item.address}
                                    update={(address)=> {
                                        this.setState({address: [address]});
                                        this.props.setItem(this.state);
                                    }}
                                />
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>Apt #</Form.Label>
                                    <Form.Control
                                        name="buildingNum"
                                        value={item.buildingNum}
                                        onChange={this.handleInputChange}
                                        placeholder="789" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label>Phone Number *</Form.Label>
                            <Form.Control
                                name="phoneNum"
                                value={item.phoneNum}
                                onChange={this.onPhoneChange}
                                placeholder="(000) 000-0000" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                                name="website"
                                value={item.website}
                                onChange={this.handleInputChange}
                                placeholder="www.health.com" />
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
                                    this.props.setItem(this.state);
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
                                    this.props.setItem(this.state);
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
                                    this.props.setItem(this.state);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                name="epic"
                                value={item.epic}
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
                                    this.props.setItem(this.state);
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
                                    this.props.setItem(this.state);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                name="childcare"
                                value={item.childcare}
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
                                    this.props.setItem(this.state);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Additional Note(s)</Form.Label>
                            <Form.Control
                                name="notes"
                                value={item.notes}
                                onChange={this.handleInputChange}
                                as="textarea"
                                rows="3" />
                        </Form.Group>
                    </Fragment>
                );
            default:
                return;
        }
    }
}

export default RowForm;
