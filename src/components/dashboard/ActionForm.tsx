import React, { useState } from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import Button from 'react-bootstrap/Button';
import FormCheck from 'react-bootstrap/FormCheck';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Form from 'react-bootstrap/Form';

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
          + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
          + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
          + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
          + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
          + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

const actionOptions = [
  'Donate', 'Uber', 'Doordash', 'Postmates', 'Grubhub', 'Custom'
];

const ActionForm = (props) => {
  const [actions, setActions] = useState(actionOptions.map((item) => ({
    action: item,
    linkText: props.links ? props.links[item] : '',
    selected: props.links ? props.links[item] : false
  })));

  const selectFormatter = (cell, row, index) => (
    <FormCheck
      type="radio"
      label={actions[index].action}
      checked={actions[index].selected}
      onClick={() => {
        const data = actions;
        data[index].selected = !data[index].selected; //! UNSURE
        setActions(data);
        setTimeout(() => props.onChange(actions), 100);
      }}
    />
  );

  const linkTextFormatter = (cell, row, index) => (
    <Form.Group>
      <Form.Control
        name="link"
        value={actions[index].linkText}
        onChange={null}
        placeholder="www.health.com"
      />
      {
        'websiteURL'.length > 0
        && (
        <p>
          <small style={{color:validURL('www.asdf.com')? 'green' : 'red'}}>
            { validURL('www.asdf.com') ? 'Valid URL' : 'Invalid URL' }
          </small>
        </p>
        )
      }
    </Form.Group>
  );

  const columns = [
    {
      dataField: 'actions',
      text: 'Actions',
      formatter: selectFormatter,
    }, {
      dataField: 'linkText',
      text: 'Links',
      formatter: linkTextFormatter,
    }];

  return (
    <BootstrapTable
      keyField="actions"
      data={actions}
      columns={columns}
      bordered={false}
    />
  );
};

export default ActionForm;