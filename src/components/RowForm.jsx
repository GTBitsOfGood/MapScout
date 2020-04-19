import React, {useState, Fragment, useEffect} from 'react';
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
import Select from "react-select";
import Button from "react-bootstrap/Button";

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
    const defaultItem = {
        facilityName: '',
        address: [],
        buildingNum: [],
        childcare: [false],
        epic: [false],
        hours: {},
        notes: [],
        phoneNum: [],
        website: [],
        image: 'modalimage.png',
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/gtbog-pacts.appspot.com/o/images%2Fmodalimage.png?alt=media&token=89e30d02-02ff-40c5-bcc5-177eebd9ccc8'
    };

    const [item, setItem] = useState(props.item.facilityName ? props.item : defaultItem);

    useEffect(() => {
        const itemFields = Object.keys(props.filters);
        itemFields.forEach((field) => { defaultItem[field] = []; });
        setItem(props.item.facilityName ? props.item : defaultItem);
    }, [props.filters]);

    function handleInputChange(e) {
        let newItem = {};
        if (e.target.type === "checkbox") {
            setItem({ ...item, [e.target.name]: [e.target.checked] });
            newItem = { ...item, [e.target.name]: [e.target.checked] };
        } else {
            setItem({ ...item, [e.target.name]: [e.target.value] });
            newItem = { ...item, [e.target.name]: [e.target.value] };
        }
        props.setItem(newItem);
    }

    function onPhoneChange(e) {
        let newItem = {};
        if (e.target.value.length === 4 && e.target.value[0] === "(") {
            setItem({ ...item, phoneNum: [e.target.value] });
            newItem = { ...item, phoneNum: [e.target.value] };
        } else {
            setItem({
                ...item,
                phoneNum: [new AsYouType("US").input(e.target.value)]
            });
            newItem = {
                ...item,
                phoneNum: [new AsYouType("US").input(e.target.value)]
            };
        }
        props.setItem(newItem);
    }

    function onTimeChange(hours) {
        const newItem = {
            ...item,
            hours: {
                Monday: hours[0].selected
                    ? [hours[0].start, hours[0].end]
                    : null,
                Tuesday: hours[1].selected
                    ? [hours[1].start, hours[1].end]
                    : null,
                Wednesday: hours[2].selected
                    ? [hours[2].start, hours[2].end]
                    : null,
                Thursday: hours[3].selected
                    ? [hours[3].start, hours[3].end]
                    : null,
                Friday: hours[4].selected
                    ? [hours[4].start, hours[4].end]
                    : null,
                Saturday: hours[5].selected
                    ? [hours[5].start, hours[5].end]
                    : null,
                Sunday: hours[6].selected
                    ? [hours[6].start, hours[6].end]
                    : null
            }
        };
        setItem(newItem);
        props.setItem(newItem);
    }

    const handleUploadSuccess = async filename => {
        let newItem = { ...item, image: filename };
        setItem(newItem);
        await storage.ref('images').child(filename).getDownloadURL()
        .then(url => {
            newItem = { ...newItem, imageURL: url };
            setItem(newItem);
        })
        props.setItem(newItem);
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
                                    props.setItem({
                                        ...item,
                                        [e.target.name]: e.target.value
                                    });
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
                                        props.setItem({
                                            ...item,
                                            address: [address]
                                        });
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
                                    <Button block>
                                        Upload
                                        <FileUploader
                                            hidden
                                            accept="image/*"
                                            name='image'
                                            storageRef={storage.ref('images')}
                                            onUploadSuccess={handleUploadSuccess} />
                                    </Button>
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
                        {
                            Object.entries(props.filters).map(([key, { name, options }]) =>
                                <Form.Group key={key}>
                                    <Form.Label>{name}</Form.Label>
                                    <MultiSelect
                                        options={options}
                                        selected={item[key]}
                                        onSelectedChanged={(selected) => {
                                            const newItem = {
                                                ...item,
                                                [key]: selected
                                            };
                                            setItem(newItem);
                                            props.setItem(newItem);
                                        }}
                                    />
                                </Form.Group>
                            )
                        }
                    </Fragment>
                );
            case 3:
                return(
                <Fragment>
                        {
                            Object.entries(props.descriptions).map(([key, { name, options }]) =>
                                <Form.Group key={key}>
                                    <Form.Label>{name}</Form.Label>
                                    <Form.Control as="textarea"/>
                                </Form.Group>
                            )
                        }
                    </Fragment>
                );
            case 4:
                return(
                <Fragment>
                    {
                    Object.entries(props.categories).map(([key, { name, options }]) =>
                                <Form.Group key={key}>
                                    <Form.Label>{name}</Form.Label>
                                    <Select
                                        options={options}
                                        selected={item[key]}
                                        maxMenuHeight={220}
                                        menuPlacement="auto"
                                        onSelectedChanged={(selected) => {
                                            const newItem = {
                                                ...item,
                                                [key]: selected
                                            };
                                            setItem(newItem);
                                            props.setItem(newItem);
                                        }}
                                    />
                                </Form.Group>
                            )
                    }

                </Fragment>

                );
            default:
                return;
        }
}

export default RowForm;
