import "./App.css";
import List from "./components/List";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || null
  );
  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(username));
  }, [username]);

  const Submit = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="App">
      {username == null ? (
        <div style={{ marginTop: "230px" }} className="form">
          <div className="subtitle">Welcome 👋 Let's create your account!</div>
          <div className="input-container ic1">
            <input
              style={{ marginTop: "10px" }}
              value={username}
              onChange={Submit}
              placeholder="username"
            />
            <button style={{ marginLeft: "2px" }} onClick={Submit} type="text">
              Submit
            </button>
          </div>
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<List />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
