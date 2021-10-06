import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAcaBg0G-Pmfvzc78UGkll8hPa4EyrQn5M",
    authDomain: "mystique-eca83.firebaseapp.com",
    projectId: "mystique-eca83",
    storageBucket: "mystique-eca83.appspot.com",
    messagingSenderId: "542939771990",
    appId: "1:542939771990:web:9c2e1603f062371fb4b7f7",
    measurementId: "G-THW03TTDK9"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default db;  