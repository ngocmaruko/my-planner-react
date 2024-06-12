import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import JournalEntry from './components/JournalEntry';
import JournalList from './components/JournalList';
import Notes from './components/Notes'
import firebase from './firebaseInit';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const databaseRef = firebase.database().ref('journalEntries');

    const handleData = (snapshot) => {
      const entriesData = snapshot.val() || [];
      console.log("Entries retrieved from Firebase:", entriesData); 
      setJournalEntries(entriesData);
    };

    databaseRef.on('value', handleData);

    return () => {
      databaseRef.off('value', handleData);
    };
  }, []);

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleCreateJournal = () => {
    setCurrentEntry(null);
    setShowJournalEntry(true);
    setShowMenu(false);
  };

  const handleSelectJournalEntry = (entry) => {
    setCurrentEntry(entry);
    setShowJournalEntry(true);
    setShowMenu(false);
  };

  const handleSaveJournalEntry = (entryText) => {
    if (!entryText.trim()) {
      setShowJournalEntry(false);
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const newEntry = { date: currentDate, text: entryText };

    let updatedEntries = [];

    if (currentEntry) {
      updatedEntries = journalEntries.map(entry => 
        entry.date === currentEntry.date && entry.text === currentEntry.text 
          ? { ...entry, text: entryText } 
          : entry
      );
    } else {
      updatedEntries = [...journalEntries, newEntry];
    }

    console.log("Updated entries:", updatedEntries);

    setJournalEntries(updatedEntries);
    firebase.database().ref('journalEntries').set(updatedEntries);
    setShowJournalEntry(false);
  };

  const handleDeleteJournalEntry = (e, entryToDelete) => {
    e.stopPropagation();
    console.log("Entry to delete:", entryToDelete);

    const updatedEntries = journalEntries.filter(entry => 
      entry.date !== entryToDelete.date || entry.text !== entryToDelete.text
    );
    console.log("Updated entries:", updatedEntries);

    setJournalEntries(updatedEntries);
    firebase.database().ref('journalEntries').set(updatedEntries);
  };

  const handleBackToJournalList = () => {
    setShowJournalEntry(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Function to handle showing/hiding Notes
  const handleShowNotes = () => {
    setShowNotes(!showNotes);
    setShowMenu(false);
    if (!showNotes) {
      navigate('/Notes');
    }
  };

  return (
    <div className="App">
      <div className={`left-column ${showMenu ? 'show-menu' : ''}`}>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="hamburger"></div>
        </div>
        <button onClick={() => { setShowJournalEntry(false); setShowMenu(false); navigate('/TodoList'); }}>Todo List</button>
        <button onClick={() => { setShowJournalEntry(false); setShowMenu(false); navigate('/MyJournal'); }}>My Journal</button>
        <button onClick={handleShowNotes}>Notes</button> {/* Button for Notes */}
      </div>
      <div className="right-column">
        <Routes>
          <Route path="/TodoList" element={
            <>
              <h1>My ToDo Calendar</h1>
              <Calendar onDateClick={handleDateClick} />
              {selectedDate !== null && (
                <TodoList
                  date={selectedDate}
                  month={new Date().toLocaleString('en-US', { month: 'long' })}
                  year={new Date().getFullYear()}
                />
              )}
            </>
          }/>
          <Route path="/MyJournal" element={
            <>
              {!showJournalEntry && (
                <JournalList
                  entries={journalEntries}
                  onCreate={handleCreateJournal}
                  onSelect={handleSelectJournalEntry}
                  onDelete={handleDeleteJournalEntry}
                />
              )}
              {showJournalEntry && (
                <JournalEntry
                  entry={currentEntry}
                  onSave={handleSaveJournalEntry}
                  onBack={handleBackToJournalList}
                />
              )}
            </>
          }/>
          <Route path="/Notes" element={<Notes />} /> {/* Route for Notes component */}
          <Route path="/" element={<Navigate replace to="/TodoList" />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
