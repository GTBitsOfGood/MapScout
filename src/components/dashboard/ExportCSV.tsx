import React,{Component} from 'react';
import { jsonToCSV } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import { array } from 'prop-types';

const ExportCSV = (props) => {

  function arrayToJson() {
    //Make a providers temp array to edit
    let providersCopy : {team: string}[] = Array.from(props.providers);
  
    //iterates through providers array and converts each provider to a JSON object
    for (let index = 0; index < providersCopy.length; index++) {
      //deletes the team property from each array
      delete providersCopy[index].team;
    }
    return JSON.stringify(providersCopy);
  }

  function handleClick() {
    const jsonData = 
    `[{
        "Column 1": "1",
        "Column 2": "2",
        "Column 3": "3",
        "Column 4": "4"
      },
      {
        "Column 1": "5",
        "Column 2": "6",
        "Column 3": "7",
        "Column 4": "8"
      },
      {
        "Column 1": "9",
        "Column 2": "10",
        "Column 3": "11",
        "Column 4": "12"
      },
      {
        "Column 1": 14,
        "Column 2": 15,
        "Column 3": 16,
        "Column 4": 17
      }]`

    const config = {
      quotes: false, //or array of booleans
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      header: true,
      newline: "{",
      skipEmptyLines: false, //or 'greedy',
      columns: null //or array of strings
    }

    const results = jsonToCSV(arrayToJson(), config);
    console.log(results);

    var dataString = results.split(/\r?\n/);
    dataString = dataString.slice(1);
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
  return (
      <Button block variant="secondary" onClick={handleClick}>Export CSV</Button>
  );
}

export default ExportCSV;
