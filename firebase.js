import firebase from "firebase/compat/app";
import { getFirestore, collection } from "firebase/firestore";
import "firebase/compat/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD2c6ucplbilZgNQMcR6KdWf-_5-Vj_0L0",
  authDomain: "realtime-database-29a09.firebaseapp.com",
  databaseURL: "https://realtime-database-29a09-default-rtdb.firebaseio.com",
  projectId: "realtime-database-29a09",
  storageBucket: "realtime-database-29a09.appspot.com",
  messagingSenderId: "25396518480",
  appId: "1:25396518480:web:760154de114209ececbb55"
};

firebase.initializeApp(firebaseConfig)
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")

export default firebase