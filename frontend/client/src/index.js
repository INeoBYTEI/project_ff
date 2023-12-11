// Dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
// Styles
import './styles/index.css';
import './styles/Navbar.css';
import './styles/Home.css';
import './styles/Create.css';
import './styles/Catalog.css';
// React App
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
