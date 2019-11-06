import React, {Component, Fragment} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {compose} from "redux";
import {withFirestore} from "react-redux-firebase";

// updateFirestore = async () => {
//     //Change 'ages' to the specific parameter to update
//     await this.props.firestore.update({collection: 'providers', doc: this.state.itemUpdates['facilityName']}, {'ages': '10'});
//     await this.props.firestore.get('providers')
// };

const SingleProvider = (props) => <Container>
    <Button onClick={async () => {
        await props.firestore.delete({collection: 'providers', doc: props.item['facilityName']});props.firestore.get('providers');
        props.firestore.get('providers')
    }}>Delete</Button>
    {
        Object.keys(props.item).map((item, index) =>
            <div key={index}>
                <h2>{item}</h2>
            </div>
        )
    }
</Container>;

export default compose(withFirestore)(SingleProvider)
