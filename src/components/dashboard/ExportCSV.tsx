import React,{Component} from 'react';
import { jsonToCSV } from 'react-papaparse';
import Button from 'react-bootstrap/Button';

export default class JsonToCSV extends Component {

  handleClick = () => {
    const jsonData = `[
      {
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
      }
    ]`

    const results = jsonToCSV(jsonData)
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
  render(){
    return (
      <Button variant="primary" onClick={this.handleClick}>Export to CSV</Button>
    )
  }

}
