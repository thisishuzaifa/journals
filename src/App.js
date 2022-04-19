import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import * as amplify from './amplify'
import { Button, Loader, Authenticator } from '@aws-amplify/ui-react';
import AppForm from './AppForm';
import { useEffect, useState } from 'react'




function App() {

  return (
    <div className="App">
      <title>Journal App</title>
      <Authenticator>
        {({ signOut, user }) => {
          console.log('from authenticator component: ', user);

          return (
            < main >
              <AppForm />
            </main>
          )
        }}
      </Authenticator>
    </div>
  );
}

export default App;
