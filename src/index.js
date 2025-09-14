import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/styles.css';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> {/* Biar global state login kebaca */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);