import React from 'react';
import MultiSelect from "@khanacademy/react-multi-select";

const options = [
    {label: "One", value: 1},
    {label: "Two", value: 2},
    {label: "Three", value: 3},
];

class MultiInput extends React.Component {
    state = {
        selected: [],
    };

    render() {
        const {selected} = this.state;

        return <MultiSelect
            options={options}
            selected={selected}
            onSelectedChanged={selected => this.setState({selected})}
        />
    }
}

export default MultiInput;
