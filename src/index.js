import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Authenticator } from '@aws-amplify/ui-react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Authenticator.Provider>
  <App />
  </Authenticator.Provider>
);

