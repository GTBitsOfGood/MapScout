import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers/index';
import freeze from 'redux-freeze';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'


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
firebase.firestore();

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);

const history = createBrowserHistory();
const loggerMiddleware = createLogger();

let middlewares = [
    routerMiddleware(history),
    thunkMiddleware,
];

if (process.env.NODE_ENV !== 'production') {
    middlewares.push(freeze);
    middlewares.push(loggerMiddleware);
}

let middleware = applyMiddleware(...middlewares);


const store = createStoreWithFirebase(
    connectRouter(history)(rootReducer),
    middleware,
);

export { store, history };
