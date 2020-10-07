import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AsYouType, isValidNumberForRegion, parseIncompletePhoneNumber } from 'libphonenumber-js';
import MultiSelect from '@khanacademy/react-multi-select';
import FileUploader from 'react-firebase-file-uploader';
import Select from 'react-select';
import { storage } from '../../store';
import TimeTable from './TimeTable';
import GoogleSuggest from './GoogleSuggest';

import ActionForm from './ActionForm';

function validURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
        + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
        + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

const RowForm = (props) => {
  const defaultItem = {
    facilityName: '',
    address: [],
    description: '',
    buildingNum: [],
    childcare: [false],
    epic: [false],
    hours: {},
    notes: [],
    phoneNum: [],
    website: [],
    image: 'modalimage.png',
    imageURL: null,
  };

  const [item, setItem] = useState(props.item.facilityName ? props.item : defaultItem);

  useEffect(() => {
    const itemFields = Object.keys(props.filters);
    itemFields.forEach((field) => { defaultItem[field] = []; });
    setItem(props.item.facilityName ? props.item : defaultItem);
  }, [props.filters]);

  function handleInputChange(e) {
    let newItem = {};
    if (e.target.type === 'checkbox') {
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
    if (e.target.value.length === 4 && e.target.value[0] === '(') {
      setItem({ ...item, phoneNum: [e.target.value] });
      newItem = { ...item, phoneNum: [e.target.value] };
    } else {
      setItem({
        ...item,
        phoneNum: [new AsYouType('US').input(e.target.value)],
      });
      newItem = {
        ...item,
        phoneNum: [new AsYouType('US').input(e.target.value)],
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
          : null,
      },
    };
    setItem(newItem);
    props.setItem(newItem);
  }

  function onActionTableChange(data) {
    const newItem = {
      ...item,
      actions: {
        Donate: data[0].selected
          ? data[0].linkText
          : null,
        Uber: data[1].selected
          ? data[1].linkText
          : null,
        Doordash: data[2].selected
          ? data[2].linkText
          : null,
        Postmates: data[3].selected
          ? data[3].linkText
          : null,
        Grubhub: data[4].selected
          ? data[4].linkText
          : null,
        Custom: data[5].selected
          ? data[5].linkText
          : null
      },
    };
    setItem(newItem);
    props.setItem(newItem);
  }

  const handleUploadSuccess = async (filename) => {
    let newItem = { ...item, image: filename };
    await storage.ref('images').child(filename).getDownloadURL()
      .then((url) => {
        newItem = { ...newItem, imageURL: url };
        setItem(newItem);
      });
    props.setItem(newItem);
  };

  switch (props.step) {
    case 0:
      return (
        <>
          <Form.Group>
            <Form.Label>Facility Name *</Form.Label>
            <Form.Control
              name="facilityName"
              value={item.facilityName}
              onChange={(e) => {
                setItem({
                  ...item,
                  [e.target.name]: e.target.value,
                });
                props.setItem({
                  ...item,
                  [e.target.name]: e.target.value,
                });
              }}
              placeholder="Name"
            />
          </Form.Group>
          <Row>
            <Col xs={9}>
              <GoogleSuggest
                value={item.address[0]}
                update={(address) => {
                  setItem({
                    ...item,
                    address: [address],
                  });
                  props.setItem({
                    ...item,
                    address: [address],
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
                  onChange={handleInputChange}
                  placeholder="789"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Phone Number *</Form.Label>
            <Form.Control
              name="phoneNum"
              value={item.phoneNum[0]}
              onChange={onPhoneChange}
              placeholder="(000) 000-0000"
            />
            {
              item.phoneNum.length > 0
              && (
              <p>
                <small style={{
                  color:
                          isValidNumberForRegion(parseIncompletePhoneNumber(item.phoneNum[0]), 'US')
                            ? 'green' : 'red',
                }}
                >
                  {
                          isValidNumberForRegion(parseIncompletePhoneNumber(item.phoneNum[0]), 'US')
                            ? 'Valid number' : 'Invalid number'
                      }
                </small>
              </p>
              )
            }
          </Form.Group>
          <Row>
            <Col xs={8}>
              <Form.Group>
                <Form.Label>Website</Form.Label>
                <Form.Control
                  name="website"
                  value={item.website[0]}
                  onChange={handleInputChange}
                  placeholder="www.health.com"
                />
                {
                  item.website.length > 0
                  && (
                  <p>
                    <small style={{
                      color:
                              validURL(item.website[0])
                                ? 'green' : 'red',
                    }}
                    >
                      {
                              validURL(item.website[0])
                                ? 'Valid URL' : 'Invalid URL'
                          }
                    </small>
                  </p>
                  )
                }
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <br />
                <label className="btn btn-primary btn-block">
                  Upload
                  <FileUploader
                    hidden
                    accept="image/*"
                    name="image"
                    storageRef={storage.ref('images')}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </label>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>About</Form.Label>
            <Form.Control
              name="description"
              value={item.description}
              onChange={(e: any) => {
                setItem({
                  ...item,
                  [e.target.name]: e.target.value,
                });
                props.setItem({
                  ...item,
                  [e.target.name]: e.target.value,
                });
              }}
              placeholder="About me"
              rows="4"
              as="textarea"
            />
          </Form.Group>
        </>
      );
    case 1:
      return (
        <TimeTable
          hours={props.item.hours || {}}
          onChange={onTimeChange}
        />
      );
    case 2:
      return (
        <>
          {
            Object.entries(props.filters).map(([key, { name, options }]: any) => (
              <Form.Group key={key}>
                <Form.Label>{name}</Form.Label>
                <MultiSelect
                  options={options}
                  selected={item[key] || []}
                  onSelectedChanged={(selected) => {
                    const newItem = {
                      ...item,
                      [key]: selected,
                    };
                    setItem(newItem);
                    props.setItem(newItem);
                  }}
                />
              </Form.Group>
            ))
          }
        </>
      );
    case 3:
      return (
        <>
          {
            Object.entries(props.descriptions).map(([key, { name, options }]: any) => (
              <Form.Group key={key}>
                <Form.Label>{name}</Form.Label>
                <Form.Control
                  as="textarea"
                  value={item[key]}
                  onChange={(e: any) => {
                    const newItem = {
                      ...item,
                      [key]: e.target.value,
                    };
                    setItem(newItem);
                    props.setItem(newItem);
                  }}
                />
              </Form.Group>
            ))
          }
        </>
      );
    case 4:
      return (
        <>
          {
            Object.entries(props.categories).map(([key, { name, options }]: any) => (
              <Form.Group key={key}>
                <Form.Label>{name}</Form.Label>
                <Select
                  options={options}
                  selected={item[key] || []}
                  maxMenuHeight={220}
                  menuPlacement="auto"
                  onSelectedChanged={(selected) => {
                    const newItem = {
                      ...item,
                      [key]: selected,
                    };
                    setItem(newItem);
                    props.setItem(newItem);
                  }}
                />
              </Form.Group>
            ))
          }
        </>

      );
    case 5:
      return (
        <ActionForm
          actions={props.item.actions || {}}
          onChange={onActionTableChange} />
      );
    default:
      return null;
  }
};

export default RowForm;
