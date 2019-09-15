import React, { useEffect } from "react";
import ParentLogin from './components/ParentLogin';
import ChildLogin from './components/ChildLogin';
import { messaging } from './init-fcm';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Login() {
  return (
    <div className="row text-center w-100">
      <div className="col-sm-6 banner">
        <h1 className="text-white mt-5">Welcome to Hygiene.io!</h1>
        <h4 className="text-white mt-5 w-75 ml-auto mr-auto">Proper hygiene is key to a healthy lifestyle and 9 out of 10 doctors agree, you should start teaching your children about hygiene as early as possible.</h4>
      </div>
      <div className="col-sm-6 full-height">
        <div className="row justify-content-center extra-padding">
          <Link to="/parent/" className="w-100">
            <button type="button" className="btn btn-primary drop-shadow m-3 mt-5 w-75">
              <h3 className="m-0">PARENT</h3>
            </button>
          </Link>
        </div>
        <div className="row justify-content-center">
          <Link to="/child/" className="w-100">
            <button type="button" className="btn btn-primary drop-shadow m-3 w-75">
              <h3 className="m-0">CHILD</h3>
            </button>
          </Link>
        </div>
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

const App = () => {
  useEffect(() => {
    messaging.requestPermission()
      .then(async function () {
        const token = await messaging.getToken();
        console.log(token)
      })
      .catch(function (err) {
        console.log("Unable to get permission to notify.", err);
      });
    navigator.serviceWorker.addEventListener("message", (message) => console.log(message));

  }, [])
  return (
    <Router>
      <div className="container-fluid p-0">
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
