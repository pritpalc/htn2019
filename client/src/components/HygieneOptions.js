import React from 'react';
import { postAuthenticatedData } from '../utils';

class HygieneOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      childDescription: props.childDescription,
      isTeen: props.isTeen,
      showerSchedule: props.showerSchedule,
      brushingSchedule: props.brushingSchedule,
      deodorant: props.deodorant
    };
  }

  // TODO: call API for onChange for each input (pass down token)
  updateChildDescription(e) {
    e.preventDefault();
  }

  updatePreferences(e) {
    e.preventDefault();
  }

  deleteChild(e) {
    this.props.deleteChild(e.code); // TODO: pass in child code
  }

  render() {
    // TODO: add a section to choose age category first and then recommend
    // TODO: takes in props for all selected
    // TODO: add links for more instructions or add text detailing everything
    return (
      <div className="container">
        <h3>Preferences for Child</h3>
        <form onSubmit={this.updatePreferences.bind(this)}>
          <div className="form-group">
            <label htmlFor="childName">Child's Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="childName" 
              placeholder="Enter name" 
              value={this.state.name} 
              onChange={this.updateChildDescription.bind(this)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="isTeen">Age Category</label>
            <select 
              className="custom-select my-1 mr-sm-2" 
              id="isTeen"
            >
              <option value={false} selected>5 - 11</option>
              <option value={true}>12 - 18</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="showerSchedule">Shower Schedule</label>
            <select 
              className="custom-select my-1 mr-sm-2" 
              id="showerSchedule"
            >
              <option value="Daily (Recommended)" selected>Daily (Recommended)</option>
              <option value="Twice a day">Twice a day</option>
              <option value="Once a week">Once a week</option>
              <option value="Twice a week">Twice a week</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="brushingSchedule">Brushing Schedule</label>
            <select 
              className="custom-select my-1 mr-sm-2" 
              id="brushingSchedule"
            >
              <option value="Once a day">Once a day</option>
              <option value="Twice a day (Recommended)" selected>Twice a day (Recommended)</option>
              <option value="Three times a day">Three times a day</option>
              <option value="Once every two days">Once every two days</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="deodorant">Deodorant</label>
            <select 
              className="custom-select my-1 mr-sm-2" 
              id="deodorant"
            >
              <option value="Never">Never</option>
              <option value="Once a day (Recommended)" selected>Once a day (Recommended)</option>
              <option value="Twice a day">Twice a day</option>
              <option value="Once every two days">Once every two days</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
          <button className="btn btn-danger" onClick={this.deleteChild}>Delete</button>
        </form>
        <hr />
      </div>
    );
  }
}

HygieneOptions.defaultProps = {
  isTeen: false
};

export default HygieneOptions;