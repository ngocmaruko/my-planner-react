import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import JournalEntry from './components/JournalEntry';
import JournalList from './components/JournalList';
import Notes from './components/Notes';
import firebase from './firebaseInit';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const databaseRef = firebase.database().ref('journalEntries');
    const handleData = (snapshot) => {
      const entriesData = snapshot.val() || [];
      setJournalEntries(entriesData);
    };

    databaseRef.on('value', handleData);

    return () => {
      databaseRef.off('value', handleData);
    };
  }, []);

  useEffect(() => {
    if (selectedDate !== null) {
      const todoRef = firebase.database().ref(`todos/${selectedDate}`);
      todoRef.on('value', (snapshot) => {
        const todosData = snapshot.val();
        const todosWithCompletion = todosData ? todosData.map(todo => ({ text: todo, completed: false })) : [];
        setTodos(todosWithCompletion);
      });
    }
  }, [selectedDate]);

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

  const handleSaveJournalEntry = (entryText, selectedEmoji) => {
    if (!entryText.trim()) {
      setShowJournalEntry(false);
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const newEntry = { date: currentDate, text: entryText, emoji: selectedEmoji };

    let updatedEntries;

    if (currentEntry) {
      // Update the existing entry
      updatedEntries = journalEntries.map(entry =>
        entry.date === currentEntry.date && entry.text === currentEntry.text
          ? { ...entry, text: entryText, emoji: selectedEmoji }
          : entry
      );
    } else {
      // Add a new entry
      updatedEntries = [...journalEntries, newEntry];
    }

    setJournalEntries(updatedEntries);
    firebase.database().ref('journalEntries').set(updatedEntries);
    setShowJournalEntry(false);
  };

  const handleDeleteJournalEntry = (e, entryToDelete) => {
    e.stopPropagation();

    const updatedEntries = journalEntries.filter(entry => 
      entry.date !== entryToDelete.date || entry.text !== entryToDelete.text
    );

    setJournalEntries(updatedEntries);
    firebase.database().ref('journalEntries').set(updatedEntries);
  };

  const handleBackToJournalList = () => {
    setShowJournalEntry(false);
  };

  return (
    <div className="App">
      <Navbar navigate={navigate} />
      <div className="right-column">
        <Routes>
          <Route path="/TodoList" element={
            <>
              <h1>My ToDo Calendar</h1>
              <Calendar onDateClick={handleDateClick} todos={todos} /> {/* Pass todos data to Calendar */}
              {selectedDate !== null && (
                <TodoList
                  date={selectedDate}
                  month={new Date().toLocaleString('en-US', { month: 'long' })}
                  year={new Date().getFullYear()}
                  onTodosChange={setTodos} // Update todos data in the parent component
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
          <Route path="/Notes" element={<Notes />} />
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
