import React,{Component} from 'react';
import { jsonToCSV } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import {CSVReader} from 'react-papaparse';
import { createDocumentRegistry, createKeywordTypeNode } from 'typescript';

const ExportCSV = (props) => {

  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const columns = ["address", "buildingNum", "description", "facilityName", "hours", "id",
  "image", "imageURL", "latitude", "longitude", "phoneNum", "website"];
  const importConfig = {
    quotes: true, //or array of booleans
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\n",
    complete: {handleOnDrop},
    skipEmptyLines: 'false', //or 'greedy',
    columns: columns
  }

  const exportConfig = {
    quotes: true, //or array of booleans
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\n",
    skipEmptyLines: 'false', //or 'greedy',
    columns: columns //or array of strings
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
    const results = jsonToCSV(arrayToJson(), exportConfig);
    var dataString = results.split(/\r?\n/);
    var dataArray = [];
    for(var i =0; i < dataString.length; i++){
      var subrray = [dataString[i]];
      dataArray.push(subrray);
    }
    let csvContent = "data:text/csv;charset=utf-8,";

    dataArray.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  function handleOnDrop(data) {
    let oldProviders : {id: string}[] = Array.from(props.providers);
    let oldCategories: {id: string}[] = Array.from(props.categories);
    console.log("older categories", oldCategories);
    console.log("older Providers", oldProviders);
    console.log('---------------------------')
    console.log("data", data)
    console.log('---------------------------')

    let mergedProviders = data.slice();
    let isDifferent = false;
    for(let i = 0; i < oldProviders.length; i++) {
      for (let j = 0; j < mergedProviders.length; j++) {
        if (oldProviders[i] != undefined || mergedProviders[j] != undefined ) {
          continue;
        } else if (oldProviders[i].id.localeCompare(mergedProviders[j].data.id) == 0) { //non-match in ID
          isDifferent = true;
        }
      }
      if (isDifferent) {
        mergedProviders.push(oldProviders[i]);
      }
      isDifferent = false;
    }

    for(let i = 0; i < data.slice().length; i++){
      let entry = data.slice()[i].data;
      for(var column in entry) {
        let col = column; //column in csv
        let val = entry[column]; // data corresponding the column
        let containsName = false;
        for(let j =0; j < oldCategories.length; j++){
          if(oldCategories[j]["id"]=== col){
            containsName = true;
            let options =oldCategories[j]["options"];
            if(val != ""){
              let ele = {label: val, value: val};
              // push ele to option array
              options.push(ele);
            }
            break;
          }
        }
        console.log(containsName)
        if(!containsName){
          // create a new object and push it to mergedCategories
          var arr= [];
          if(val != ""){
            let ele = {label: val, value: val};
            arr.push(ele)
          }
          // manually set priority and select_type to 0
          let newCatategories = {
            id: col, 
            name: col, 
            options:arr, 
            priority: oldProviders.length, 
            select_type: 2
          };
          oldCategories.push(newCatategories);
        }
      }
    }

    console.log("merged Providers", mergedProviders);
    console.log("merged categories", oldCategories);
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
            onDrop={handleOnDrop}
            // onError={this.handleOnError}
            style={{}}
            config={importConfig}
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