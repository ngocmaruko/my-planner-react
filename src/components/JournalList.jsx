// JournalList.jsx
import React, { useState, useEffect } from 'react';
import firebase from '../firebaseInit'; // Import Firebase

import './JournalList.css';

const JournalList = ({ onCreate, onSelect, onDelete }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const databaseRef = firebase.database().ref('journalEntries');

    const groupEntriesByPeriod = (entries) => {
      const groupedEntries = {};
      entries.forEach((entry) => {
        const periodLabel = getPeriodLabel(entry.date);
        if (!groupedEntries[periodLabel]) {
          groupedEntries[periodLabel] = [];
        }
        groupedEntries[periodLabel].push(entry);
      });
      return groupedEntries;
    };

    const getPeriodLabel = (entryDate) => {
      const today = new Date();
      const entry = new Date(entryDate);
      const diffInDays = Math.floor((today - entry) / (1000 * 3600 * 24));

      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays <= 7) return 'Previous 7 Days';
      if (diffInDays <= 30) return 'Previous 30 Days';
      if (today.getMonth() === entry.getMonth() && today.getFullYear() === entry.getFullYear()) {
        return `This ${today.toLocaleString('default', { month: 'long' })}`;
      }
      return `${entry.toLocaleString('default', { month: 'long' })} ${entry.getFullYear()}`;
    };

    const sortPeriodLabels = (labels) => {
      const labelOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days'];
      return labels.sort((a, b) => {
        const aIndex = labelOrder.indexOf(a);
        const bIndex = labelOrder.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        const [aMonth, aYear] = a.split(' ');
        const [bMonth, bYear] = b.split(' ');
        const aDate = new Date(aYear, new Date(`${aMonth} 1`).getMonth());
        const bDate = new Date(bYear, new Date(`${bMonth} 1`).getMonth());
        return bDate - aDate;
      });
    };

    const handleData = (snapshot) => {
      const entriesData = snapshot.val() || [];
      const groupedEntries = groupEntriesByPeriod(entriesData);
      const sortedPeriods = sortPeriodLabels(Object.keys(groupedEntries));
      setEntries(sortedPeriods.map((period) => [period, groupedEntries[period]]));
    };

    databaseRef.on('value', handleData);

    return () => {
      databaseRef.off('value', handleData);
    };
  }, []);

  return (
    <div className="journal-list">
      <div className="journal-list-header">
        <h2>Journal Entries</h2>
        <button className="create-button" onClick={onCreate}>Create</button>
      </div>
      {/* Render entries */}
      {entries.map(([periodLabel, periodEntries]) => (
        <div key={periodLabel} className="journal-period">
          <h3>{periodLabel}</h3>
          <ul>
            {/* Reverse the periodEntries array */}
            {periodEntries.slice().reverse().map((entry, index) => (
              <li className='entry-list' key={index} onClick={() => onSelect(entry)}>
                <div className="entry-content">
                  <div className="">{entry.text.substring(0, 20)}...</div>
                  {entry.text && <div className="entry-date">{entry.date}</div>}
                </div>
                <div className="entry-emoji">{entry.emoji}</div>
                
                <button className="delete-button" onClick={(e) => onDelete(e, entry)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default JournalList;
