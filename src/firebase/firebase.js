import app from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDhA6ue9yEMupXLN7MyZPHkrp2bXs_KlSA",
    authDomain: "gtbog-pacts.firebaseapp.com",
    databaseURL: "https://gtbog-pacts.firebaseio.com",
    projectId: "gtbog-pacts",
    storageBucket: "",
    messagingSenderId: "973317690227",
    appId: "1:973317690227:web:4c9e435640d534914b2b06"
};
class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.database = app.firestore();
        this.signInEmailPassword = (email, password) =>
            this.auth.signInWithEmailAndPassword(email, password);
    }

}
export default Firebase;
