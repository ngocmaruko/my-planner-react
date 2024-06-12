// JournalEntry.jsx
import React, { useState, useEffect } from 'react';
import firebase from '../firebaseInit'; // Import Firebase

import './JournalEntry.css';

const JournalEntry = ({ entry, onSave, onBack }) => {
  const [entryText, setEntryText] = useState(entry ? entry.text : '');
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (entry) {
      setEntryText(entry.text);
    }
  }, [entry]);

  const handleSave = () => {
    onSave(entryText);
    setEntryText('');
  };

  return (
    <div className="journal-entry">
      <div className="journal-entry-header">
        <button className="back-button" onClick={onBack}>Entries</button>
        <div className="date-label">{currentDate}</div>
        <button className="done-button" onClick={handleSave}>Done</button>
      </div>
      <textarea className='entry-text'
        value={entryText}
        onChange={(e) => setEntryText(e.target.value)}
      />
    </div>
  );
};

export default JournalEntry;
