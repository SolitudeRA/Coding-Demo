import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/global.css'
import './stylesheets/index.css';
import Prefectures from './components/Prefectures';
import Charts from './components/Charts';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Prefectures />
    <Charts />
  </React.StrictMode>,
);

reportWebVitals(console.log);
