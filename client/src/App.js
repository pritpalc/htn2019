import React, { useEffect } from "react";
import ParentLogin from './components/ParentLogin';
import ChildLogin from './components/ChildLogin';
import { messaging} from './init-fcm';
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

const App = ()  => {
  useEffect(() => {
    messaging.requestPermission()
        .then(async function() {
          const token = await messaging.getToken();
          console.log(token)
        })
        .catch(function(err) {
          console.log("Unable to get permission to notify.", err);
        });
      navigator.serviceWorker.addEventListener("message", (message) => console.log(message));

  }, [])
  return (
    <Router>
      <div className="container">
        <div className="row justify-content-center">
          <Route path="/" exact component={Login} />
          <Route path="/parent/" component={Parent} />
          <Route path="/child/" component={Child} />
        </div>
      </div>
    </Router>
  );
}

export default App;
