import "./App.css";
import List from "./components/List";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState(
    JSON.parse(localStorage.getItem("username")) || ""
  );
  const [loggedin, setloggedin] = useState(
    JSON.parse(localStorage.getItem("loggedin")) || false
  );

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(username));
    localStorage.setItem("loggedin", JSON.stringify(loggedin));
  }, [loggedin]);

  const Submit = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="App">
      {loggedin == false ? (
        <div
          style={{
            marginTop: "230px",
          }}
          className="form"
        >
          <div className="subtitle">Welcome 👋 Let's create your account!</div>
          <div className="input-container ic1">
            <input
              value={username}
              onChange={Submit}
              placeholder="username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
            <button
              style={{ margin: "5px" }}
              onClick={() => setloggedin(true)}
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<List username={username} />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
