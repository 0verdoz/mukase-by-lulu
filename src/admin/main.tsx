import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { AdminApp } from './AdminApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element for Admin Portal');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
