import React from 'react';
const FirebaseContext = React.createContext(null);

export const firebaseConsumer = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;
