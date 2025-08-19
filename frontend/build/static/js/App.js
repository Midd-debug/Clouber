import React, { useState } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import "./index.css";

function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="app-container">
      {!token ? (
        <div className="auth-container">
          <div className="toggle-buttons">
            <button
              className={`toggle-btn ${!showRegister ? "active" : ""}`}
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>
            <button
              className={`toggle-btn ${showRegister ? "active" : ""}`}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
          <div className="auth-box">
            {!showRegister ? (
              <Login setToken={setToken} />
            ) : (
              <Register />
            )}
          </div>
        </div>
      ) : (
        <Chat token={token} />
      )}
    </div>
  );
}

export default App;
