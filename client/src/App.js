import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);

  useEffect(() => {
    if (token) localStorage.setItem('jwt', token);
    else localStorage.removeItem('jwt');
  }, [token]);

  return (
      <div className="container">
        <div className="header">
          <h2>Telemetry Dashboard</h2>
          {token && <button onClick={() => setToken(null)}>Logout</button>}
        </div>
        {!token ? <Login onLogin={setToken} /> : <Dashboard token={token} />}
      </div>
  );
}

export default App;
