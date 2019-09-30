import React, { Component } from 'react';
import CsvUpload from './CsvUpload';
import Auth from "./Auth";
import NavBar from './NavBar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import {Route, Switch, Redirect} from "react-router-dom";
import firebase from "firebase";

const mapStateToProps = state => (state.mainReducer);
export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const authRoute = '/providers/auth';

class ProviderRoutes extends Component {
    render() {
        return (
            <div>
                <NavBar/>
                <Switch>
                    <PrivateRoute exact path='/providers' component={CsvUpload}/>
                    <Route path={authRoute} component={Auth}/>
                </Switch>
            </div>
        )
    }
}

//Redirects unauthenticated users to auth screen
const PrivateRoute = ({ component: Component }) => (
    <Route render={props => (
        // Check if user is logged in
        // TODO: Move firebase stuff to redux+cookies, this here is bad
        firebase.auth().currentUser != null ?
            <Component {...props}/>
            :
            <Redirect to={{
                pathname: authRoute,
                state: { from: props.location }
            }}/>
    )}/>
);


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProviderRoutes);
