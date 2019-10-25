import React, {Component, Fragment} from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import Button from "react-bootstrap/Button";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function timeFormatter(cell, row) {
    return (
        <TimePicker start="10:00" end="21:00" step={30} />
    );
}

function actionFormatter(cell, row) {
    return (
        <Button>Copy Above</Button>
    );
}

const columns = [{
    dataField: 'day',
    text: 'Day',
}, {
    dataField: 'start',
    text: 'Start Time',
    formatter: timeFormatter,
}, {
    dataField: 'end',
    text: 'End Time',
    formatter: timeFormatter,
}, {
    dataField: 'action',
    text: ' ',
    formatter: actionFormatter,
}];

const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    selected: [0, 1, 2, 3, 4, 5, 6],
    hideSelectAll: true
};

export default class TimeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            days: [
                {
                    day: "Monday",
                    start: "0",
                    end: "0",
                    action: ""
                },
                {
                    day: "Tuesday",
                    start: "0",
                    end: "0",
                    action: ""
                },
                {
                    day: "Wednesday",
                    start: "0",
                    end: "0",
                    action: ""
                },
                {
                    day: "Thursday",
                    start: "0",
                    end: "0",
                    action: ""
                },
                {
                    day: "Friday",
                    start: "0",
                    end: "0",
                    action: ""
                },
                {
                    day: "Saturday",
                    start: "0",
                    end: "0",
                    action: ""
                },
                {
                    day: "Sunday",
                    start: "0",
                    end: "0",
                    action: ""
                }
            ]
        }
    }

    render() {
        const { days } = this.state;

        return (
            <BootstrapTable
                keyField='day'
                data={ days }
                columns={ columns }
                selectRow={ selectRow }
                bordered={ false }
            />
        )
    }
}
