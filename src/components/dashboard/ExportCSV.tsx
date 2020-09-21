import React,{Component} from 'react';
import { jsonToCSV } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import { array } from 'prop-types';

const ExportCSV = (props) => {

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

  function handleClick() {
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
  return (
      <Button block variant="secondary" onClick={handleClick}>Export CSV</Button>
  );
}

export default ExportCSV;
