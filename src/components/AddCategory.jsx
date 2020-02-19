import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirestore } from "react-redux-firebase";
import {providerRoute} from "./ProviderRoutes";
const AddCategoryPage = () => (
    <div>
        <h1>Add Category</h1>
        <AddCategoryForm />
    </div>
);
const INITIAL_STATE = {
    name: 'erp',
    error: null,
};
class AddCategoryFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = async () => {
        const { name } = this.state;
        let firestore = this.props.firestore;
        let item = {
            "ok": "sharath",
        };
        let x = await this.props.firestore.set({collection: 'categories', doc: this.state.name}, item);
        console.log(x);

    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { fieldval, error } = this.state;
        const isInvalid = fieldval === '';
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="name"
                    value={this.state.fieldval}
                    onChange={this.onChange}
                    type="text"
                    placeholder="bring it right back"
                />
                <button disabled={isInvalid} type="submit">
                    Submit Document
                </button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

export default AddCategoryPage;
const AddCategoryForm = withFirestore(AddCategoryFormBase);
export { AddCategoryForm };
