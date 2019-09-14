import React from 'react';

class HygieneOptions extends React.Component {
  constructor() {
    super();

    this.state = {
      addChild: false
    };
  }

  addChild() {
    this.setState({
      addChild: true
    });
  }

  render() {
    if (this.state.addChild) {
      // TODO: add a section to choose age category first and then recommend
      return (
        <div className="container">
          <form>
            <div className="form-group">
              <label htmlFor="option1">Showers</label>
              <select class="custom-select my-1 mr-sm-2" id="option1">
                <option selected>Recommended</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="option2">Brushing</label>
              <select class="custom-select my-1 mr-sm-2" id="option2">
                <option selected>Recommended</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" /* TODO: onClick={} */>Submit</button>
          </form>
        </div>
      );
    } else {
      // TODO: add capabilities to add multiple children
      return (
        <div className="container">
          <div className="row justify-content-center">
            <button type="button" className="btn btn-primary m-3" onClick={this.addChild.bind(this)}>
              Add Child
            </button>
          </div>
        </div>
      );
    }
  }
}

export default HygieneOptions;