import React from 'react';
import TodoList from './components/TodoList';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css'

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <TodoList />
      </ErrorBoundary>
    </div>
  );
}

export default App;
