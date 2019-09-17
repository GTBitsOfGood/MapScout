import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import CsvUpload from './CsvUpload';
import NavBar from './NavBar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

const mapStateToProps = state => (state.mainReducer);

export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar/>
                <RB.Grid>
                    {/*TODO: Make login work*/}
                    <RB.Jumbotron>
                        <RB.Form>
                            <RB.FormGroup controlId="formBasicEmail">
                                <RB.Label>Email address</RB.Label>
                                <RB.FormControl type="email" placeholder="Enter email" />
                            </RB.FormGroup>
                            <RB.FormGroup controlId="formBasicPassword">
                                <RB.Label>Password</RB.Label>
                                <RB.FormControl type="password" placeholder="Password" />
                            </RB.FormGroup>
                            <RB.Button variant="primary" type="submit">
                                Submit
                            </RB.Button>
                        </RB.Form>
                    </RB.Jumbotron>
                    {/*TODO: Hide CSV if user hasn't logged in*/}
                    <CsvUpload uploadCsv={file => this.props.uploadCsv(file)} />
                </RB.Grid>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(About);
