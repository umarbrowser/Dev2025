import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('app');

if (rootElement) {
  const page = rootElement.getAttribute('data-page') || '';
  const propsRaw = rootElement.getAttribute('data-props') || '{}';
  let props = {};

  try {
    props = JSON.parse(propsRaw);
  } catch (e) {
    props = {};
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App page={page} initialProps={props} />
    </React.StrictMode>
  );
}
