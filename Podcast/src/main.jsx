import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'; // Import createRoot from 'react-dom/client'.
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

/**
 * Render the React app into the root element.
 * @param {HTMLElement} rootElement - The root element where the app should be rendered.
 */
function renderApp(rootElement) {
  createRoot(rootElement).render( // Use createRoot without ReactDOM.
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

const rootElement = document.getElementById('root');

// Call the renderApp function with the root element.
renderApp(rootElement);
