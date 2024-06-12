import React, { useState, useEffect } from 'react';
import './Notes.css'; // Assuming you have CSS styles defined here
import notesImg from '../assets/notes.png';
import editImg from '../assets/edit.png';
import deleteImg from '../assets/delete.png';
import firebase from '../firebaseInit';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const notesRef = firebase.database().ref('notes');

    notesRef.on('value', (snapshot) => {
      const notesData = snapshot.val();
      if (notesData) {
        const notesArray = Object.keys(notesData).map(key => ({
          id: key,
          content: notesData[key].content
        }));
        setNotes(notesArray);
      } else {
        setNotes([]);
      }
    });

    return () => {
      notesRef.off('value');
    };
  }, []);

  const handleCreateNote = () => {
    const newNote = { id: Date.now(), content: '' };
    firebase.database().ref('notes').push(newNote);
  };

  const handleDeleteNote = (id) => {
    firebase.database().ref(`notes/${id}`).remove();
  };

  const handleContentChange = (id, newContent) => {
    firebase.database().ref(`notes/${id}`).update({ content: newContent });
  };

  return (
    <div className='container'>
      <h1><img src={notesImg} alt="Notes" />Notes</h1>
      <button className='btn' onClick={handleCreateNote}>
        <img src={editImg} alt="Create Note" />Create Note
      </button>
      <div className="notes-container">
        {notes.map(note => (
          <div key={note.id} className="note">
            <div className="note-content">
              <textarea
                className='input-box'
                value={note.content}
                onChange={(e) => handleContentChange(note.id, e.target.value)}
              />
              <img 
                src={deleteImg} 
                alt="delete" 
                className="delete-icon" 
                onClick={() => handleDeleteNote(note.id)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
