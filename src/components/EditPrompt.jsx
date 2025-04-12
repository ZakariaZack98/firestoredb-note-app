import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';

const EditPrompt = ({ editNoteMode, setEditNoteMode, selectedNote }) => {
  const [updatedNote, setUpdatedNote] = useState({ ...selectedNote });
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedNote((prevNote) => ({
      ...prevNote,
      [name]: value, 
    }));
  };


  /**
  * TODO: UPDATE THE NOTE WITH UPDATED INPUT & UPDATE FEED =========================================================
  * @param {event} object formdata from the edit prompt
  * */ 
  const updateNote = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'users', auth.currentUser.uid);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        const currentNotes = docSnap.data().noteList || [];
        const updatedNotes = currentNotes.map(item => 
          item.createdAt === updatedNote.createdAt ? updatedNote : item
        )
        await updateDoc(docRef, {
          noteList: updatedNotes
        })
      }
      toast.success('Task updated successfully')
    } catch (err) {
      console.error('Note edit failed', err.message)
    } finally {
      setEditNoteMode(false)
    }
  };

  return (
    <div
      className={`addNote rounded-2xl bg-white text-black p-5 w-[50dvw] h-[60dvh]`}
      style={{ zIndex: 50 }}
    >
      <form className="z-50" onSubmit={updateNote}>
        <div className="flex items-center gap-x-3">
          <label htmlFor="title" className="text-lg">
            Title:{' '}
          </label>
          <input
            type="text"
            name="title"
            value={updatedNote.title}
            className="border-2 border-black rounded-md px-2 py-1 w-full"
            onChange={changeHandler}
          />
        </div>
        <div className="flex items-center gap-x-3 my-3">
          <label htmlFor="type">Select Type:</label>
          <select
            name="type"
            id="type"
            className="px-4 py-2 border-2 border-black rounded-md"
            value={updatedNote.type}
            onChange={changeHandler}
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
            value={updatedNote.note}
            onChange={changeHandler}
          ></textarea>
        </div>
        <div className="flex w-full justify-end my-2 gap-x-3">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setEditNoteMode(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
          >
            Edit note
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPrompt;