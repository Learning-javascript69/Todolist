// client/src/components/TodoList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css'; // Ensure this exists for styling

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null); // Keeps track of which todo is being edited
  const [newTodoText, setNewTodoText] = useState(''); // Holds the text for the edited todo
  const [newTodo, setNewTodo] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Manages whether you're in edit mode
  const [editId, setEditId] = useState(null); // Stores the ID of the todo being edited

  const handleEditClick = (id) => {
    const todoToEdit = todos.find((todo) => todo._id === id);
    if (!todoToEdit) {
      console.error("Todo not found for ID:", id);
      return;
    }
    console.log("Editing Todo:", todoToEdit);  // Check if the correct todo is being edited
    setNewTodoText(todoToEdit.text);  // Set the text to the input
    setIsEditing(true);  // Change to editing state
    setEditId(id);  // Store the ID of the todo being edited
  };
  
  
  

  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos from the server
  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos'); // Relative URL
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos.');
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    console.log('Adding todo:', newTodo); // Debugging
    try {
      const response = await axios.post('/api/todos', { text: newTodo }); // Relative URL
      console.log('Todo added:', response.data); // Debugging
      setTodos([response.data, ...todos]); // Add to the beginning of the list
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo. Please try again.');
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`); // Relative URL
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo. Please try again.');
    }
  };

  // Toggle completion status
  const toggleComplete = async (id) => {
    const todo = todos.find((todo) => todo._id === id);
    if (!todo) return;

    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const response = await axios.put(`/api/todos/${id}`, updatedTodo); // Relative URL
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo. Please try again.');
    };
  }
  
    const handleEditSave = async (id) => {
      try {
        await axios.put(`http://localhost:5000/api/todos/${id}`, {
          text: newTodoText,
        });
        fetchTodos(); // Refresh the todos list after update
        setEditingTodoId(null); // Exit editing mode
      } catch (error) {
        console.error('Error editing todo:', error);
      }
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new to-do"
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-info">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id)}
              />
              <span>{todo.text}</span>
            </div>
            {editingTodoId === todo._id ? (
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
              />
            )}
            {editingTodoId === todo._id ? (
              <button onClick={() => handleEditSave(todo._id)}>Save</button>
            ) : (
              <button onClick={() => handleEditClick(todo._id)}>Edit</button>
            )}
            <button onClick={() => deleteTodo(todo._id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
