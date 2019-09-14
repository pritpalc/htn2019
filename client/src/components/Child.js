import React from 'react';
import ReactCodeInput from 'react-code-input';

class Child extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <h2>Login</h2>
        </div>
        <div className="row justify-content-center mt-3">
          <ReactCodeInput 
            type="number"
            fields={6}
            className=""
          />
        </div>
      </div>
    );
  }
}

export default Child;