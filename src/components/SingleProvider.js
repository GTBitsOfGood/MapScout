import React, {Component, Fragment} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {compose} from "redux";
import {withFirestore} from "react-redux-firebase";
import ProviderInfo from "./ProviderInfo";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

// updateFirestore = async () => {
//     //Change 'ages' to the specific parameter to update
//     await this.props.firestore.update({collection: 'providers', doc: this.state.itemUpdates['facilityName']}, {'ages': '10'});
//     await this.props.firestore.get('providers')
// };

const SingleProvider = (props) => <Container>
    <div className="row-spaced pt-3">
        <h2>{props.item.facilityName}</h2>
        <div>
            <ButtonToolbar>
                <Button
                    onClick={props.editProvider}
                    variant="info"
                    className="mr-2">
                    Edit
                </Button>
                <Button
                    variant="danger"
                    onClick={async () => {
                        props.setLoading();
                        await props.firestore.delete({collection: 'providers', doc: props.item['facilityName']});
                        await props.firestore.get('providers');
                        props.resetIndex();
                    }}>
                    Delete
                </Button>
            </ButtonToolbar>
        </div>
    </div>
    <hr />
    <ProviderInfo item={props.item} />
</Container>;

export default compose(withFirestore)(SingleProvider)
