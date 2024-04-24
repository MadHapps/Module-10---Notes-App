import React from "react"
import firebase from "../firebase";



export default function Sidebar(props) {

    function GoogleSignInButton() {
        const handleSignIn = async () => {
          const provider = new firebase.auth.GoogleAuthProvider();
          try {
            const result = await firebase.auth().signInWithPopup(provider);
            // Handle successful sign-in, e.g., navigate to a new page or update state
            console.log('User signed in:', result.user);
          } catch (error) {
            // Handle errors, e.g., display error message to the user
            console.error('Google sign-in error:', error.message);
          }
        };
      
        return (
          <button onClick={handleSignIn}>Sign in with Google</button>
        );
      }


    const noteElements = props.notes.map((note, index) => (
        <div key={note.id}>
            <div
                
                className={`title ${
                    note.id === props.currentNote.id ? "selected-note" : ""
                }`}
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
                <button 
                    className="delete-btn"
                    onClick={() => props.deleteNote(note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <GoogleSignInButton />
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}
