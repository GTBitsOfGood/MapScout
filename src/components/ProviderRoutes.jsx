import React, { Component } from 'react';
import Dashboard from './Dashboard';
import Auth from "./Auth";
import NavBar from './NavBar';

import {Route, Switch, Redirect} from "react-router-dom";
import Container from "react-bootstrap/Container";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase, isEmpty, isLoaded } from "react-redux-firebase";

const authRoute = '/providers/auth';

class ProviderRoutes extends Component {
    render() {

        const PrivateRoute = ({ component: Component }) => (
            <Route render={props => (
                // Check if user is logged in
                isEmpty(this.props.auth) ?
                    <Redirect to={{
                        pathname: authRoute,
                        state: { from: props.location }
                    }}/>
                    :
                    <Component {...props}/>
            )}/>
        );

        return (
            <div>
                <NavBar/>
                <Container>
                    <div id="auth-container">
                        {
                            isLoaded(this.props.auth) ?
                                <Switch>
                                    <PrivateRoute exact path='/providers' component={Dashboard}/>
                                    <Route path={authRoute} component={Auth}/>
                                </Switch>
                                : //TODO: Make Loading Pretty
                                <h1>Loading...</h1>
                        }
                    </div>
                </Container>
            </div>
        )
    }
}

//Need auth property to check if logged in or loading
export default compose(
    withFirebase,
    connect(({ firebase: { auth } }) => ({ auth }))
)(ProviderRoutes)
