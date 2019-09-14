import React from 'react';
import ReactCodeInput from 'react-code-input';
import { postData } from '../utils';

class Child extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      token: ""
    };
  }

  logIn(e) {
    if (e.length === 6) {
      let data = {
        username: e,
        password: e
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
  }

  render() {
    // TODO: do something when logged in
    return (
      <div className="container">
        <div className="row justify-content-center">
          <h2>Login</h2>
        </div>
        <div className="row justify-content-center mt-3">
          <ReactCodeInput 
            type="number"
            fields={6}
            onChange={this.logIn.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Child;