import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NewTask from './components/NewTask';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NewTask />
  </React.StrictMode>
);
