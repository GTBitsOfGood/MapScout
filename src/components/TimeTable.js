import React, {Component, Fragment} from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import Button from "react-bootstrap/Button";
import FormCheck from "react-bootstrap/FormCheck";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

export default class TimeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            days: [
                {
                    day: "Monday",
                    start: 0,
                    end: 0,
                    action: "",
                    selected: false
                },
                {
                    day: "Tuesday",
                    start: 0,
                    end: 0,
                    action: "",
                    selected: false
                },
                {
                    day: "Wednesday",
                    start: 0,
                    end: 0,
                    action: "",
                    selected: false
                },
                {
                    day: "Thursday",
                    start: 0,
                    end: 0,
                    action: "",
                    selected: false
                },
                {
                    day: "Friday",
                    start: 0,
                    end: 0,
                    action: "",
                    selected: false
                },
                {
                    day: "Saturday",
                    start: 0,
                    end: 0,
                    action: "",
                    selected: false
                },
                {
                    day: "Sunday",
                    start: 0,
                    end: 0,
                    action: "",
                    selected: false
                }
            ],
            selected: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        }
    }

    handleOnSelect = (row, isSelect, index) => {
        let days = this.state.days;
        if (isSelect) {
            this.setState(() => ({
                selected: [...this.state.selected, row.id]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row.id)
            }));
        }
        days[index].selected = isSelect;
        this.setState({days});
        this.props.onChange(days);
    };

    render() {
        const { days } = this.state;


        const selectFormatter = (cell, row, index) => {
            return (
                <FormCheck
                    type="radio"
                    label={days[index].day}
                    checked={days[index].selected}
                    onClick={() => {
                        const data = days;
                        data[index].selected = !data[index].selected;
                        this.setState({days: data});
                        setTimeout(() => this.props.onChange(days), 100);
                    }}/>
            );
        };

        const timeFormatter = (cell, row, index, formatExtraData) => {
            return (
                <TimePicker
                    onChange={(time) => {
                        const data = days;
                        data[index][formatExtraData]= time;
                        this.setState({days: data});
                        setTimeout(() => this.props.onChange(days), 100);
                    }}
                    value={cell}
                    step={30} />
            );
        };

        const actionFormatter = (cell, row, index) => {
            return (
                <Button onClick={
                    () => {
                        let i = index === 0 ? index + 1 : index - 1;
                        const data = days;
                        data[index].start = days[i].start;
                        data[index].end = days[i].end;
                        data[index].selected = true;
                        this.setState({days: data});
                        setTimeout(() => this.props.onChange(days), 100);
                    }
                }>Copy {index === 0 ? 'Below' : 'Above'}</Button>
            );
        };

        const columns = [
            {
                dataField: 'selected',
                text: 'Day',
                formatter: selectFormatter,
            }, {
                dataField: 'start',
                text: 'Start Time',
                formatter: timeFormatter,
                formatExtraData: "start"
            }, {
                dataField: 'end',
                text: 'End Time',
                formatter: timeFormatter,
                formatExtraData: "end"
            }, {
                dataField: 'action',
                text: ' ',
                formatter: actionFormatter,
            }];

        return (
            <BootstrapTable
                keyField='day'
                data={ days }
                columns={ columns }
                bordered={ false }
            />
        )
    }
}
