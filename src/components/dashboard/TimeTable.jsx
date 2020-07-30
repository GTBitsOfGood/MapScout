import React, { useState } from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import Button from 'react-bootstrap/Button';
import FormCheck from 'react-bootstrap/FormCheck';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const TimeTable = (props) => {
  const [days, setDays] = useState(daysOfWeek.map((item) => ({
    day: item,
    start: props.hours[item] ? props.hours[item][0] : 0,
    end: props.hours[item] ? props.hours[item][1] : 0,
    action: '',
    selected: props.hours[item] && props.hours[item].length === 2,
  })));
  const [selected, setSelected] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

  const selectFormatter = (cell, row, index) => (
    <FormCheck
      type="radio"
      label={days[index].day}
      checked={days[index].selected}
      onClick={() => {
        const data = days;
        data[index].selected = !data[index].selected; //! UNSURE
        setDays(data);
        setTimeout(() => props.onChange(days), 100);
      }}
    />
  );

  const timeFormatter = (cell, row, index, formatExtraData) => (
    <TimePicker
      onChange={(time) => {
        const data = days;
        data[index][formatExtraData] = time;
        setDays(data);
        setTimeout(() => props.onChange(days), 100);
      }}
      value={cell}
      step={30}
    />
  );

  const actionFormatter = (cell, row, index) => (
    <Button onClick={
                () => {
                  const i = index === 0 ? index + 1 : index - 1;
                  const data = days;
                  data[index].start = days[i].start;
                  data[index].end = days[i].end;
                  data[index].selected = true;
                  setDays(data);
                  setTimeout(() => props.onChange(days), 100);
                }
            }
    >
      Copy
      {' '}
      {index === 0 ? 'Below' : 'Above'}
    </Button>
  );

  const columns = [
    {
      dataField: 'selected',
      text: 'Day',
      formatter: selectFormatter,
    }, {
      dataField: 'start',
      text: 'Start Time',
      formatter: timeFormatter,
      formatExtraData: 'start',
    }, {
      dataField: 'end',
      text: 'End Time',
      formatter: timeFormatter,
      formatExtraData: 'end',
    }, {
      dataField: 'action',
      text: ' ',
      formatter: actionFormatter,
    }];

  return (
    <BootstrapTable
      keyField="day"
      data={days}
      columns={columns}
      bordered={false}
    />
  );
};
export default TimeTable;
