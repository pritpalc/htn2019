import React from 'react';
import Children from './Children';
import { messaging} from '../init-fcm';
import { postData, getAuthenticatedData, postAuthenticatedData } from '../utils';

class ParentLogin extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      token: "",
      children: undefined
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
        return this.setState({
          token: JSON.parse(response).token,
          loggedIn: true})
        })
          .catch(error => console.log(error))
          .then(() =>  messaging.requestPermission()) 
          .then(() =>  messaging.getToken())
          .then(token => postAuthenticatedData('/api/user/registerToken',{token}, this.state.token))
          .catch((err) => console.log("Unable to get permission to notify.", err))
  }

  render() {
    if (this.state.loggedIn) {
      return <Children token={this.state.token} />
    } else {
      return (
        <div className="container">
          <div className="row justify-content-center">
            <h2>Login</h2>
          </div>
          <form onSubmit={this.logIn.bind(this)}>
            <div className="form-group">
              <label htmlFor="inputEmail">Username</label>
              <input type="username" className="form-control" id="inputEmail" placeholder="Enter username" />
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

export default ParentLogin;