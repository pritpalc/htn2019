import React from "react";
import ParentLogin from './components/ParentLogin';
import ChildLogin from './components/ChildLogin';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Login() {
  return (
    <div className="text-center">
      <h2>Login</h2>
      <div className="row justify-content-center">
      <Link to="/parent/">
        <button type="button" className="btn btn-primary m-3 mt-5">
          <h3 className="m-0">Parent</h3>
        </button>
      </Link>
      </div>
      <div className="row justify-content-center">
        <Link to="/child/">
          <button type="button" className="btn btn-primary m-3">
            <h3 className="m-0">Child</h3>
          </button>
        </Link>
      </div>
    </div>
  );
}

function Parent() {
  return <ParentLogin />;
}

function Child() {
  return <ChildLogin />;
}

function App() {
  return (
    <Router>
      <div className="container">
        <div className="row justify-content-center mt-3">
          <Route path="/" exact component={Login} />
          <Route path="/parent/" component={Parent} />
          <Route path="/child/" component={Child} />
        </div>
      </div>
    </Router>
  );
}

export default App;
