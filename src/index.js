import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, history } from './store';
import { routes } from './routes';
import { ConnectedRouter } from 'connected-react-router';
import './assets/styles/style';
import App from './components/App';


import Firebase, { FirebaseContext } from './firebase';
import {Switch} from "react-router-dom";

// render the main component
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <FirebaseContext.Provider value={new Firebase()}>
                {routes}
            </FirebaseContext.Provider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
);
