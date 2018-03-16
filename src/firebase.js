import firebase from 'firebase';

// Initialising firebase database
const config = {
  apiKey: "AIzaSyD7qaCVNHWrOid_mL18k0xW5A1zb94WFOI",
  authDomain: "serverhackathon.firebaseapp.com",
  databaseURL: "https://serverhackathon.firebaseio.com",
  projectId: "serverhackathon",
  storageBucket: "serverhackathon.appspot.com",
  messagingSenderId: "761233921971"
};
firebase.initializeApp(config)

export default firebase;