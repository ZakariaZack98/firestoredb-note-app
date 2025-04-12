import React, { useEffect, useState } from "react";
import Login from "./pages/LogIn/LogIn";
import { auth, db } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { arrayUnion, doc, updateDoc, onSnapshot, arrayRemove, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import NoteCard from "./components/noteCard";
import EditPrompt from "./components/EditPrompt";

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [addTaskMode, setAddTaskMode] = useState(false);
  const [selectedNote, setselectedNote] = useState({});
  const [editNoteMode, setEditNoteMode] = useState(false);
  const [notesData, setNotesData] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'Personal',
    note: '',
    createdAt: '',
    completed: false
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
        const docRef = doc(db, 'users', user.uid)
        const unsubSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const fetchedNotesData = docSnap.data().noteList || [];
            setNotesData(fetchedNotesData.filter(note => note.completed === false));
          } else console.log('No such docs')
        })
        return () => unsubSnapshot();
      }
      else {
        setUserLoggedIn(false)
      }
    })
    return () => unsub();
  }, [])

  const changeHandler = (e) => {
    let updatedTask = {};
    if (e.target.name === 'title') {
      updatedTask = { ...newTask, title: e.target.value };
    } else if (e.target.name === 'type') {
      updatedTask = { ...newTask, type: e.target.value };
    } else {
      updatedTask = { ...newTask, note: e.target.value };
    }
    setNewTask(updatedTask);
  };

  async function handleDeleteNote(note) {
    console.log("Note to delete:", note); // Log the note being passed
    const docRef = doc(db, 'users', auth.currentUser.uid);

    try {
      await updateDoc(docRef, {
        noteList: arrayRemove(note),
      });
      console.log('Note deleted successfully');
    } catch (err) {
      console.error('Error deleting note:', err.message);
    }
  }

  async function handleComplete(note) {
    console.log("Note to update:", note);
    const docRef = doc(db, 'users', auth.currentUser.uid);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentNotes = docSnap.data().noteList || [];
        const updatedNotes = currentNotes.map((item) =>
          item.createdAt === note.createdAt ? { ...item, completed: true } : item
        );
        await updateDoc(docRef, {
          noteList: updatedNotes
        })
        console.log('task completed')
      }
      console.log('Note deleted successfully');
    } catch (err) {
      console.error('Error completing task:', err.message);
    }
  }

  const handleEdit = note => {
    setselectedNote(note);
    setEditNoteMode(true);
  }

  const addNote = async (e) => {
    e.preventDefault();
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const finalTask = { ...newTask, createdAt: Date.now(), completed: false};
    try {
      await updateDoc(userRef, {
        noteList: arrayUnion(finalTask),
      });
      toast.success('Task Added Successfully');
      setAddTaskMode(false);
      setNewTask({
        title: '',
        type: 'Personal',
        note: '',
        createdAt: '',
        completed: false,
      });
    } catch (err) {
      toast.error(`Error adding task: ${err.message}`);
    }
  };

  if (userLoggedIn) {
    return (
      <div className="body relative min-h-screen bg-center bg-cover text-white font-poppins">
        <div className={`absolute w-full h-full flex justify-center items-center ${editNoteMode ? 'visible' : 'hidden'}`}>
          {
            editNoteMode && <EditPrompt note={selectedNote} editNoteMode={editNoteMode} setEditNoteMode={setEditNoteMode} selectedNote={selectedNote}/>
          }
        </div>
        <div className="p-20 backdrop-blur-2xl h-screen">
          <h1 className="font-semibold text-5xl font-poppins">
            Hello, {auth.currentUser?.displayName}
          </h1>
          <h1 className="font-black text-[60px] font-poppins">
            What's on your mind?
          </h1>
          <div className="add relative">
            <button
              className="text-2xl px-6 py-2 border-2 rounded border-white cursor-pointer"
              onClick={() => setAddTaskMode(true)}
            >
              + Add Note
            </button>
            <div
              className={`addNote absolute left-10 top-10 rounded-2xl bg-white text-black p-5 w-[50dvw] h-[60dvh] ${addTaskMode ? 'visible' : 'hidden'
                }`}
              style={{ zIndex: 50 }}
            >
              <form className="z-50">
                <div className="flex items-center gap-x-3">
                  <label htmlFor="title" className="text-lg">
                    Title:{' '}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    className="border-2 border-black rounded-md px-2 py-1 w-full"
                    onChange={(e) => changeHandler(e)}
                  />
                </div>
                <div className="flex items-center gap-x-3 my-3">
                  <label htmlFor="type">Select Type:</label>
                  <select
                    name="type"
                    id="type"
                    className="px-4 py-2 border-2 border-black rounded-md"
                    value={newTask.type}
                    onChange={(e) => changeHandler(e)}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="flex flex-col gap-y-3">
                  <label htmlFor="note">Note:</label>
                  <textarea
                    name="note"
                    id="note"
                    className="p-3 border-2 border-black rounded-lg h-[30dvh]"
                    value={newTask.note}
                    onChange={(e) => changeHandler(e)}
                  ></textarea>
                </div>
                <div className="flex w-full justify-end my-2 gap-x-3">
                  <button
                    className="px-6 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setAddTaskMode(false);
                      setNewTask({
                        title: '',
                        type: 'Personal',
                        note: '',
                        createdAt: '',
                        completed: false,
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
                    onClick={(e) => addNote(e)}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="noteGrid flex flex-wrap items-stretch gap-3 my-10">
            {
              notesData?.map(note => <NoteCard key={note.createdAt} date={note.createdAt} title={note.title} type={note.type} note={note.note} clickHandler={() => handleDeleteNote(note)} completeHandler={() => handleComplete(note)} editHandler={() => handleEdit(note)}/>)
            }
          </div>
          <button onClick={() => signOut(auth)}>Log out</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="body h-screen flex justify-center items-center bg-center bg-cover text-white">
        <Login />
      </div>
    );
  }
};

export default App;
