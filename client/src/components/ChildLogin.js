import React from 'react';
import ReactCodeInput from 'react-code-input';
import { messaging} from '../init-fcm';
import { postData, postAuthenticatedData } from '../utils';
import CharacterViewer from './CharacterViewer';
import { Link } from "react-router-dom";

class ChildLogin extends React.Component {
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
          return this.setState({
            token: JSON.parse(response).token,
            loggedIn: true
          });
        })
        .catch(error => console.log(error))
        .then(() =>  messaging.requestPermission()) 
        .then(() =>  messaging.getToken())
        .then(token => postAuthenticatedData('/api/child/registerToken',{token}, this.state.token))
        .catch((err) => console.log("Unable to get permission to notify.", err))
    }
  }

  render() {
    // TODO: do something when logged in
    const { loggedIn, token } = this.state;
    if (loggedIn) {
      return (
        <CharacterViewer token={token}/>
      )
    } else {
      return (
        <div className="col-12 vh-100 d-flex flex-column align-items-center justify-content-center">
          <h2>Enter Code</h2>
          <ReactCodeInput 
            type="number"
            fields={6}
            onChange={this.logIn.bind(this)}
          />
          <Link to="/" className="pt-5 text-center"><p>&larr; Back</p></Link>
        </div>
      );
    }
  }
}

export default ChildLogin;