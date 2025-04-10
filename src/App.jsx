import React, { useEffect, useState } from "react";
import Login from "./pages/LogIn/LogIn";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });

    
    return () => unsubscribe();
  }, []);

  if (userLoggedIn) {
    return (
      <div>
        <button onClick={() => signOut(auth)}>Log out</button>
      </div>
    );
  } else {
    return (
      <div className="body h-screen flex justify-content-center items-center bg-center bg-cover text-white">
        <Login />
      </div>
    );
  }
};

export default App;
