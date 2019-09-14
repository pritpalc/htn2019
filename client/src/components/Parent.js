import React from 'react';
import HygieneOptions from './HygieneOptions';

class Parent extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false
    };
  }

  logIn() {
    this.setState({
      loggedIn: true
    });
  }

  render() {
    if (this.state.loggedIn) {
      return <HygieneOptions />
    } else {
      return (
        <div className="container">
          <div className="row justify-content-center">
            <h2>Login</h2>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="inputEmail">Email address</label>
              <input type="email" className="form-control" id="inputEmail" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="inputPass">Password</label>
              <input type="password" className="form-control" id="inputPass" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.logIn.bind(this)}>Submit</button>
          </form>
        </div>
      );
    }
  }
}

export default Parent;