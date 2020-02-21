import React, {useState, Component, Fragment} from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import Button from "react-bootstrap/Button";
import FormCheck from "react-bootstrap/FormCheck";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const TimeTable = (props) => {
    let arr = [];
    days.map((item) =>
            arr.push({
                day: item,
                start: props.hours[item] ? props.hours[item][0] : 0,
                end: props.hours[item] ? props.hours[item][1] : 0,
                action: "",
                selected: props.hours[item] && props.hours[item].length === 2
            })
        );
    console.log(arr);
    const [days, setDays] = useState(arr);
    const [selected, setSelected] = useState ([0, 1, 2, 3, 4, 5, 6, 7 ])

    handleOnSelect = (row, isSelect, index) => {
        if(isSelect) {
            setSelected([...selected, row.id])
        } else {
            setSelected([...selected.filter(x => x !== row.id)])
        }
        days[index].selected = isSelect; //! UNSURE
        setDays({days});
        props.onChange(days);

    };
    const selectFormatter = (cell, row, index) => {
        return (
            <FormCheck
                type="radio"
                label={days[index].day}
                checked={days[index].selected}
                onClick={() => {
                    const data = days;
                    data[index].selected = !data[index].selected; //! UNSURE
                    setDays({days: data});
                    setTimeout(() => props.onChange(days), 100);
                }}/>
        );
    };

    const timeFormatter = (cell, row, index, formatExtraData) => {
        return (
            <TimePicker
                onChange={(time) => {
                    const data = days;
                    data[index][formatExtraData]= time;
                    setDays({days: data});
                    setTimeout(() => props.onChange(days), 100);
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
                    setDays({days: data});
                    setTimeout(() => props.onChange(days), 100);
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
export default TimeTable


/* export default class TimeTable extends Component {
    constructor(props) {
        super(props);
        let arr = [];
        days.map((item) =>
            arr.push({
                day: item,
                start: props.hours[item] ? props.hours[item][0] : 0,
                end: props.hours[item] ? props.hours[item][1] : 0,
                action: "",
                selected: props.hours[item] && props.hours[item].length === 2
            })
        );
        console.log(arr);
        this.state = {
            days: arr,
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
    } */
