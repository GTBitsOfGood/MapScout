import React, { Component } from 'react';
import Dashboard from './Dashboard';
import Auth from "./Auth";
import NavBar from './NavBar';

import {Route, Switch, Redirect} from "react-router-dom";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase, isEmpty, isLoaded } from "react-redux-firebase";
import Container from "react-bootstrap/Container";

export const providerRoute = '/providers/dash';
export const authRoute = '/providers/auth';

class ProviderRoutes extends Component {

    render() {
        const PrivateRoute = ({ component: Component }) => (
            <Route render={props => {
                if (isEmpty(this.props.auth)) {
                    this.setState({key: authRoute});
                    return (
                        <Redirect to={{
                            pathname: authRoute,
                            state: { from: props.location }
                        }}/>
                    )
                }
                return  <Component {...props}/>
            }}/>
        );

        return (
            <div id="root">
                <NavBar />
                { isLoaded(this.props.auth) &&
                    <Switch>
                        <PrivateRoute exact path={providerRoute} component={Dashboard}/>
                        <Route path={authRoute} render={() =>
                            <Auth onSubmit={() => this.props.history.push(providerRoute)}/>
                        }/>
                    </Switch>
                }
            </div>
        )
    }
}

//Need auth property to check if logged in or loading
export default compose(
    withFirebase,
    connect(({ firebase: { auth } }) => ({ auth }))
)(ProviderRoutes)
