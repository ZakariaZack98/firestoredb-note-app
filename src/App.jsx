import React, { useState } from 'react';
import Login from './pages/LogIn/LogIn';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      {
        loggedIn ? (<div>Logged In</div>) : (
          <div className="body h-screen flex justify-content-center items-center bg-center bg-cover text-white">
            <Login/>
          </div>
        )
      }
    </div>
  )
}

export default App
