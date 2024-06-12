import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './JournalEntry.css'; // Import your custom CSS for JournalEntry styling

const JournalEntry = ({ entry, onSave, onBack }) => {
  const [entryText, setEntryText] = useState(entry ? entry.text : '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Track whether to show emoji picker
  const [selectedEmoji, setSelectedEmoji] = useState(entry ? entry.emoji : ''); // Initialize selectedEmoji
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (entry) {
      setEntryText(entry.text);
      setSelectedEmoji(entry.emoji);
    }
  }, [entry]);

  const handleSave = () => {
    onSave(entryText, selectedEmoji); // Pass both text and emoji to onSave
    setEntryText('');
    setSelectedEmoji(''); // Reset selectedEmoji
  };

  const handleEmojiClick = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
  };

  return (
    <div className="journal-entry">
      <div className="journal-entry-header">
        <button className="back-button" onClick={onBack}>Entries</button>
        <div className="date-label">{currentDate}</div>
        <button className="done-button" onClick={handleSave}>Done</button>
      </div>
      <textarea
        className='entry-text'
        value={entryText}
        onChange={(e) => setEntryText(e.target.value)}
      />
      <div className="emoji-selection">
        <button className="emoji-selection-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>How has your day been?</button>
        {selectedEmoji && (
          <div className="selected-emoji-box">{selectedEmoji}</div>
        )}
      </div>
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          pickerStyle={{ /* Add your custom styles here */ }}
        />
      )}
    </div>
  );
};

export default JournalEntry;
