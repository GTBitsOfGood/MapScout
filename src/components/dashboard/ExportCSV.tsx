import React,{Component} from 'react';
import { jsonToCSV } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import {CSVReader} from 'react-papaparse';

const ExportCSV = (props) => {

  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const importconfig = {
    quotes: true, //or array of booleans
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\n",
    complete: {importData},
    skipEmptyLines: 'false', //or 'greedy',
    columns: ["address", "buildingNum", "description", "facilityName", "hours", "id",
    "image", "imageURL", "latitude", "longitude", "phoneNum", "website"] //or array of strings
  }

  function arrayToJson() {
    //Make a providers temp array to edit
    let providersCopy : {team: string, hours: string}[] = Array.from(props.providers);

    //iterates through providers array and converts each provider to a JSON object
    for (let index = 0; index < props.providers.length; index++) {
      providersCopy[index].hours = JSON.stringify(providersCopy[index].hours);  //stringify the hour property
      delete providersCopy[index].team;   //deletes the team property from each provider
    }

    return providersCopy;
  }

  function handleExport() {
    const columns = ["address", "buildingNum", "description", "facilityName", "hours", "id",
                      "image", "imageURL", "latitude", "longitude", "phoneNum", "website"];

    const config = {
      quotes: true, //or array of booleans
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      header: true,
      newline: "\n",
      skipEmptyLines: 'false', //or 'greedy',
      columns: columns //or array of strings
    }

    const results = jsonToCSV(arrayToJson(), config);
    var dataString = results.split(/\r?\n/);
    var dataArray = [];
    for(var i =0; i < dataString.length; i++){
      var subrray = [dataString[i]];
      dataArray.push(subrray);
    }
    console.log(dataArray)
    let csvContent = "data:text/csv;charset=utf-8,";

    dataArray.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  function importData(results, file) {

  }

  return (
    <>
      <DropdownButton id="dropdown-split-variants-secondary" variant="secondary" title="CSV">
        <Dropdown.Item onClick={handleShow}>Import</Dropdown.Item>
        <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
      </DropdownButton>
      <Modal
        size="lg" 
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Import CSV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CSVReader
            // onDrop={this.handleOnDrop}
            // onError={this.handleOnError}
            style={{}}
            config={importconfig}
            addRemoveButton
            // onRemoveFile={this.handleOnRemoveFile}
          >
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Exit
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ExportCSV;
