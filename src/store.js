import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers/index';
import freeze from 'redux-freeze';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyDhA6ue9yEMupXLN7MyZPHkrp2bXs_KlSA",
    authDomain: "gtbog-pacts.firebaseapp.com",
    databaseURL: "https://gtbog-pacts.firebaseio.com",
    projectId: "gtbog-pacts",
    storageBucket: "",
    messagingSenderId: "973317690227",
    appId: "1:973317690227:web:4c9e435640d534914b2b06"
};

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users'
    // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

firebase.initializeApp(firebaseConfig);

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig) // firebase instance as first argument
    // reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

const history = createBrowserHistory();
const loggerMiddleware = createLogger();

let middlewares = [
  routerMiddleware(history),
  thunkMiddleware,
];

// add the freeze dev middleware
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(freeze);
  middlewares.push(loggerMiddleware);
}

// apply the middleware
let middleware = applyMiddleware(...middlewares);

// create the store
const store = createStoreWithFirebase(
  connectRouter(history)(rootReducer),
  middleware,
);

export { store, history };
