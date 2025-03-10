import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
import App from './App1.jsx';
import './index.css';
import { ThemeProvider } from './ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
