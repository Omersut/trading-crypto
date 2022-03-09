import "./App.css";
import List from "./components/List";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";

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
  const login = (e) => {
    e.preventDefault();
    setloggedin(true);
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
            <form onSubmit={login}>
              <input
                value={username}
                onChange={Submit}
                placeholder="username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <button style={{ margin: "5px" }} type="submit" hidden>
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<List username={username} />} />
          </Routes>
        </Router>
      )}
      <hr />
      <Footer />
      <br />
    </div>
  );
}

export default App;
