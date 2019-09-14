import React from 'react';
import HygieneOptions from './HygieneOptions';
import { postData } from '../utils';

class Parent extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      token: ""
    };
  }

  logIn(e) {
    e.preventDefault();
    let data = {
      username: e.target.elements.inputEmail.value,
      password: e.target.elements.inputPass.value
    };
    postData("/auth/login", data)
      .then(response => {
        console.log(response);
        this.setState({
          token: JSON.parse(response).token,
          loggedIn: true})
          .then(() =>  messaging.requestPermission()) 
          .then(() =>  messaging.getToken())
          .then(notificationToken => {
            
        })
        .catch(function(err) {
          console.log("Unable to get permission to notify.", err);
        });
      navigator.serviceWorker.addEventListener("message", (message) => console.log(message));;
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (this.state.loggedIn) {
      console.log(this.state.token);
      return <HygieneOptions />
    } else {
      return (
        <div className="container">
          <div className="row justify-content-center">
            <h2>Login</h2>
          </div>
          <form onSubmit={this.logIn.bind(this)}>
            <div className="form-group">
              <label htmlFor="inputEmail">Email address</label>
              <input type="username" className="form-control" id="inputEmail" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="inputPass">Password</label>
              <input type="password" className="form-control" id="inputPass" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      );
    }
  }
}

export default Parent;