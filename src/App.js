import "./App.css";
import List from "./components/List";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [loggedin, setIsloggedin] = useState(
    localStorage.getItem("loggedin") ? "true" : "false"
  );

  const Submit = async () => {
    setIsloggedin("true");

    localStorage.setItem("loggedin", JSON.stringify(loggedin));
  };

  return (
    <div className="App">
      {loggedin == "false" ? (
        <div style={{ marginTop: "230px" }} className="form">
          <div className="subtitle">Welcome 👋 Let's create your account!</div>
          <div className="input-container ic1">
            <input
              style={{ marginTop: "10px" }}
              id="username"
              type="text"
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
