import { App } from 'app';
import React from 'react';
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
  </React.StrictMode>
);