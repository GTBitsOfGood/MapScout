import React, { useState, useEffect } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {withFirestore, isEmpty, isLoaded, withFirebase} from 'react-redux-firebase';
import NavBar from './NavBar';
import Auth from './Auth';
import Dashboard, {selectTeam} from './Dashboard';
import AddProvider from './AddProvider';
import PasswordForgetForm from "./PasswordForget";
import Template from "./template/index";
import NotFound from "./NotFound";

export const providerRoute = '/provider';
export const formRoute = '/provider/add';
export const authRoute = '/';
export const pwdRoute = '/forgot';
export const templateRoute = '/provider/template';

const ProviderRoutes = (props) => {

    const [isLoading, setIsLoading] = useState(true);

    async function fetchTeam() {
        const { firestore, team, firebaseAuth } = props;
        setIsLoading(true);
        if (team !== "pacts" && team !== "ebp" && typeof firebaseAuth.auth.uid === 'string') {
            await firestore
                .collection("users")
                .where("UID", '==', firebaseAuth.auth.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        console.log(docData.team);
                        props.selectTeam(docData.team);
                    });
                });
            setIsLoading(false);
        } else if ( isLoaded(firebaseAuth.auth) && firebaseAuth.auth.uid === undefined ) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchTeam();
    }, []);

    useEffect(() => {
        fetchTeam();
    }, [props.firebaseAuth.auth]);

    const PrivateRoute = ({ component: Component }) => (
      <Route render={(prps) => {
        if (isEmpty(props.firebaseAuth.auth)) {
          return (
            <Redirect to={{
              pathname: authRoute,
              state: { from: prps.location },
            }}
            />
          );
        }
          return <Component {...prps} />
      }}
      />
    );

    const logout = () => {
        props.firebase.logout()
            .then(function() {
                props.selectTeam("");
                props.history.push(authRoute)
            })
            .catch(function(error) {
                console.log(error)
            });
    };

    if (isLoading || !isLoaded(props.firebaseAuth.auth)) {
        return <div className="spinner-wrap">
            <div className = "spinner" />
        </div>;
    }

    return (
      <div>
        <Switch>
            <Route path={providerRoute}>
                <React.Fragment>
                    <NavBar
                        team={props.team}
                        logout={logout}/>
                    <div className="dashboard-content">
                        <Switch>
                            <PrivateRoute
                                exact
                                path={providerRoute}
                                component={Dashboard} />
                            <PrivateRoute
                                path={formRoute}
                                component={AddProvider} />
                            <PrivateRoute
                                path={templateRoute}
                                component={Template} />
                        </Switch>
                    </div>
                </React.Fragment>
            </Route>
            <Route
                exact
                path={authRoute}
                component={Auth} />
            <Route
                path={pwdRoute}
                component={PasswordForgetForm} />
            <Route exact path="*" component={NotFound} />
        </Switch>
      </div>
    );
};

const mapDispatchToProps = {
    selectTeam
};

const mapStateToProps = (state) => ({
    firebaseAuth: state.firebase,
    team: state.item.team,
});

// Need auth property to check if logged in or loading
export default compose(
  withFirestore,
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps),
)(ProviderRoutes);
