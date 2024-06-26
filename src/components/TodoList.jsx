import React, { useState, useEffect, useRef } from 'react';
import firebase from '../firebaseInit';

import './TodoList.css';

const TodoList = ({ date, month, year, scrollToTodoList }) => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const todoListRef = useRef(null);

  useEffect(() => {
    const todoRef = firebase.database().ref(`todos/${date}`);
    todoRef.on('value', (snapshot) => {
      const todosData = snapshot.val();
      setTodos(todosData || []);
    });
  }, [date]);

  useEffect(() => {
    if (scrollToTodoList && todoListRef.current) {
      todoListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToTodoList]);

  const saveTodos = (todos) => {
    firebase.database().ref(`todos/${date}`).set(todos);
  };

  const handleAddTodo = () => {
    if (!inputValue.trim()) {
      setErrorMessage('Please enter a todo before submitting');
      return;
    }
    
    if (editingIndex !== null) {
      const updatedTodos = todos.map((todo, index) => 
        index === editingIndex ? inputValue : todo
      );
      saveTodos(updatedTodos);
      setEditingIndex(null);
    } else {
      const newTodos = [...todos, inputValue];
      saveTodos(newTodos);
    }
    setInputValue('');
    setErrorMessage('');
  };

  const handleEditTodo = (index) => {
    if (!inputValue.trim()) {
      setErrorMessage('Please enter a todo before submitting');
      return;
    }
  
    console.log("Editing todo at index:", index);
    console.log("Previous todos:", todos);
  
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return inputValue; // Update the value at the specified index
      }
      return todo;
    });
  
    console.log("Updated todos:", updatedTodos);
  
    setTodos(updatedTodos); // Update the todos state
    saveTodos(updatedTodos); // Save the updated todos to Firebase
    setEditingIndex(null); // Reset editingIndex
    setInputValue(''); // Clear inputValue
    setErrorMessage(''); // Clear errorMessage
  };
  
  const handleToggleCompleted = (index) => {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed }; // Toggle the completed status
      }
      return todo;
    });
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };
  
  

  

  const handleRemoveTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    saveTodos(updatedTodos);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div ref={todoListRef} className="todo-list">
      <h2>Todos for {month} {date}, {year}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul>
      {todos.map((todo, index) => (
      <li key={index}>
        <span>{todo.text}</span>
        <span className={`dot ${todo.completed ? 'completed' : ''}`} onClick={() => handleToggleCompleted(index)}></span>
        <div>
          <button onClick={() => handleEditTodo(index)}>Edit</button>
          <button onClick={() => handleRemoveTodo(index)}>Remove</button>
        </div>
      </li>
))}

      </ul>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        onKeyPress={handleKeyPress} // Handle Enter key press
        placeholder="Add a new todo" 
      />
      <button onClick={handleAddTodo}>
        {editingIndex !== null ? 'Update Todo' : 'Add Todo'}
      </button>
    </div>
  );
};

export default TodoList;
