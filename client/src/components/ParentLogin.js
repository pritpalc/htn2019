import React from 'react';
import Children from './Children';
import { postData, getAuthenticatedData } from '../utils';

class ParentLogin extends React.Component {
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
          loggedIn: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getChildren() {
    getAuthenticatedData("/api/user/children", this.state.token)
      .then(response => {
        console.log(response);
        return response.children; // TODO: return a list of children
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (this.state.loggedIn) {
      console.log(this.state.token);
      return <Children children={this.getChildren()} />
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

export default ParentLogin;