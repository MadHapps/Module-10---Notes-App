import {useState, useEffect} from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"

export default function App() {
    
    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [tempNoteText, setTempNoteText] =  useState("")
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    const sortedNotes = notes.sort((oldest, recent) => recent.updatedAt - oldest.updatedAt)
    
    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])

    useEffect(() => {

        currentNote && setTempNoteText(currentNote.body)

    }, [currentNote])

    useEffect(() => {
        if(!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    // Text debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            tempNoteText !== currentNote.body && updateNote(tempNoteText)
        }, 750)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
    }

    // // Declarative style...
    // function updateNote(text) {
    //     setNotes(oldNotes => {
    //         const updatedNote = {...oldNotes.find(note => note.id === currentNoteId), body: text}
    //         return [updatedNote, ...oldNotes.filter(note => note.id != currentNoteId)]
    //     })

    // }

    function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}

    // Custom hook to keep useState and localStorage synced
    // function useLocalStorageState(key, defaultValue) {
    //     const [state, setState] = useState(() => {
    //       const storedValue = localStorage.getItem(key)
    //       return storedValue ? JSON.parse(storedValue) : defaultValue
    //     })
    //     useEffect(() => {
    //       localStorage.setItem(key, JSON.stringify(state))
    //     }, [key, state])
    //     return [state, setState]
    //   }


    // Without using custom hook...
    // const [notes, setNotes] = useState(
    //     () => JSON.parse(localStorage.getItem("notes")) || []
    // )

    // useEffect(() => {
    //     localStorage.setItem("notes", JSON.stringify(notes))
    // }, [notes])

        // Imperative style...
    // function updateNote(text) {
    //     setNotes(oldNotes => {
    //         const newArray = []
    //         for (let i = 0; i < oldNotes.length; i++) {
    //             const oldNote = oldNotes[i]
    //             if (oldNote.id === currentNoteId) {
    //                 // Put the most recently-modified note at the top
    //                 newArray.unshift({ ...oldNote, body: text })
    //             } else {
    //                 newArray.push(oldNote)
    //             }
    //         }
    //         return newArray
    //     })
    // }
