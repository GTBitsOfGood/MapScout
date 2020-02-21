import React, {useState, Component, Fragment} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GoogleSuggest from "./GoogleSuggest";
import TimeTable from "./TimeTable";
import {AsYouType, isValidNumberForRegion, parseIncompletePhoneNumber} from 'libphonenumber-js';
import options from "../utils/options";
import MultiSelect from "@khanacademy/react-multi-select";
import FileUploader from 'react-firebase-file-uploader';
import {storage} from '../store';
import idx from 'idx';

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

const RowForm = (props) => {
    const [item, setItem] = useState(props.item.facilityName ? props.item: {
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
        image: 'modalimage.png',
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/gtbog-pacts.appspot.com/o/images%2Fmodalimage.png?alt=media&token=89e30d02-02ff-40c5-bcc5-177eebd9ccc8'
        })

    function handleInputChange(e) {
        if(e.target.type === "checkbox") {
            setItem({ ...item, [e.target.name]: [e.target.checked] });
        } else {
            setItem({ ...item, [e.target.name]: [e.target.value] });
        }
        setTimeout(() => props.setItem(item), 100);
    }

    function onPhoneChange(e) {
        if (e.target.value.length === 4 && e.target.value[0] === "(") {
            setItem({ ...item, phoneNum: [e.target.value] });
        } else {
            setItem({
                ...item,
                phoneNum: [new AsYouType("US").input(e.target.value)]
            });
        }
        setTimeout(() => props.setItem(item), 100);
    }

    function onTimeChange(hours) {
        setItem({ ...item,
            hours: {
                Monday: hours[0].selected ? [hours[0].start, hours[0].end] : null,
                Tuesday: hours[1].selected ? [hours[1].start, hours[1].end] : null,
                Wednesday: hours[2].selected ? [hours[2].start, hours[2].end] : null,
                Thursday: hours[3].selected ? [hours[3].start, hours[3].end] : null,
                Friday: hours[4].selected ? [hours[4].start, hours[4].end] : null,
                Saturday: hours[5].selected ? [hours[5].start, hours[5].end] : null,
                Sunday: hours[6].selected ? [hours[6].start, hours[6].end] : null,
        }});
        setTimeout(() => props.setItem(item), 100);
    }

    const handleUploadSuccess = async filename => {
        await setItem({ ...item, image: filename });
        await storage.ref('images').child(filename).getDownloadURL()
        .then(url => setItem({
            ...item,
            imageURL: url
        }));
        setTimeout(() => props.setItem(item), 100);
    }

        switch (props.step) {
            case 0:
                return(
                    <Fragment>
                        <Form.Group>
                            <Form.Label>Facility Name *</Form.Label>
                            <Form.Control
                                name="facilityName"
                                value={item.facilityName}
                                onChange={(e) => {
                                    setItem({
                                        ...item,
                                        [e.target.name]: e.target.value
                                    });
                                    setTimeout(() => props.setItem(item), 100);
                                }}
                                placeholder="Name" />
                        </Form.Group>
                        <Row>
                            <Col xs={9}>
                                <GoogleSuggest
                                    value={item.address[0]}
                                    update={(address)=> {
                                        setItem({
                                            ...item,
                                            address: [address]
                                        });
                                        setTimeout(() => props.setItem(item), 100);
                                    }}
                                />
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>Apt #</Form.Label>
                                    <Form.Control
                                        name="buildingNum"
                                        value={item.buildingNum[0]}
                                        onChange={ handleInputChange }
                                        placeholder="789" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label>Phone Number *</Form.Label>
                            <Form.Control
                                name="phoneNum"
                                value={item.phoneNum[0]}
                                onChange={ onPhoneChange }
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
                        <Row>
                            <Col xs={8}>
                                <Form.Group>
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                        name="website"
                                        value={item.website[0]}
                                        onChange={ handleInputChange }
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
                            </Col>
                            <Col xs={4}>
                                <Form.Group>
                                    <Form.Label>Image</Form.Label>
                                    <br />
                                    <label className="btn btn-primary btn-block point">
                                        Upload
                                        <FileUploader
                                            hidden
                                            accept="image/*"
                                            name='image'
                                            storageRef={storage.ref('images')}
                                            onUploadSuccess={handleUploadSuccess} />
                                    </label>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Fragment>
                );
            case 1:
                return <TimeTable
                    hours={props.item.hours || {}}
                    onChange={onTimeChange}/>;
            case 2:
                return(
                    <Fragment>
                        <Form.Group>
                            <Form.Label>Service Type</Form.Label>
                            <MultiSelect
                                options={options.serviceType}
                                selected={item.serviceType}
                                onSelectedChanged={(selected) => {
                                    setItem({
                                        ...item,
                                        serviceType: selected
                                    });
                                    setTimeout(() => props.setItem(item), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Specializations</Form.Label>
                            <MultiSelect
                                options={options.specializations}
                                selected={item.specializations}
                                onSelectedChanged={(selected) => {
                                    setItem({
                                        ...item,
                                        specializations: selected
                                    });
                                    setTimeout(() => props.setItem(item), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Types of Therapy</Form.Label>
                            <MultiSelect
                                options={options.therapyTypes}
                                selected={item.therapyTypes}
                                onSelectedChanged={(selected) => {
                                    setItem({
                                        ...item,
                                        therapyTypes: selected
                                    });
                                    setTimeout(() => props.setItem(item), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                name="epic"
                                value={item.epic[0]}
                                onChange={handleInputChange}
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
                                    setItem({
                                        ...item,
                                        languages: selected
                                    });
                                    setTimeout(() => props.setItem(item), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Accepted Age(s)</Form.Label>
                            <MultiSelect
                                options={options.ages}
                                selected={item.ages}
                                onSelectedChanged={(selected) => {
                                    setItem({
                                        ...item,
                                        ages: selected
                                    });
                                    setTimeout(() => props.setItem(item), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                name="childcare"
                                value={item.childcare[0]}
                                onChange={handleInputChange}
                                type="checkbox"
                                label="Childcare Availability" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Accepted Insurance(s)</Form.Label>
                            <MultiSelect
                                options={options.insurance}
                                selected={item.insurance}
                                onSelectedChanged={(selected) => {
                                    setItem({
                                        ...item,
                                        insurance: selected
                                    });
                                    setTimeout(() => props.setItem(item), 100);
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Additional Note(s)</Form.Label>
                            <Form.Control
                                name="notes"
                                value={item.notes[0]}
                                onChange={handleInputChange}
                                as="textarea"
                                rows="3" />
                        </Form.Group>
                    </Fragment>
                );
            default:
                return;
        }  
} 

export default RowForm;
