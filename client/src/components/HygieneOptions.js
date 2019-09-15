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
      deodorant: props.deodorant,
      code: props.code,
      id: props.id
    };
  }

  updateChildDescription(e) {
    e.preventDefault();
    if (this.state.id !== undefined) {
      postAuthenticatedData(`/api/child/description/${this.state.id}`, {
        childDescription: e.target.value
      }, this.props.token);
    }

    this.setState({
      childDescription: e.target.value
    });
  }

  updateIsTeen(e) {
    if (e.target.value === "true") {
      this.setState({
        isTeen: e.target.value,
        showerSchedule: "Daily",
        brushingSchedule: "Twice a day",
        deodorant: "Once a day"
      });
    } else {
      this.setState({
        isTeen: e.target.value,
        showerSchedule: "Twice a week",
        brushingSchedule: "Once a day",
        deodorant: "Never"
      });
    }
  }

  routeUpdate(e) {
    if (this.state.id === undefined) {
      this.createChild(e);
    } else {
      this.updatePreferences(e);
    }
  }

  updatePreferences(e) {
    e.preventDefault();
    let ele = e.target.elements;
    postAuthenticatedData(`/api/child/preferences/${this.state.id}`, {
      isTeen: ele.isTeen.value,
      showerSchedule: ele.showerSchedule.value,
      brushingSchedule: ele.brushingSchedule.value,
      deodorant: ele.deodorant.value
    }, this.props.token)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  createChild(e) {
    e.preventDefault();
    let ele = e.target.elements;
    postAuthenticatedData("/api/user/newChild", {
      code: this.state.code,
      childDescription: ele.childDescription.value,
      prefs: {
        isTeen: ele.isTeen.value,
        showerSchedule: ele.showerSchedule.value,
        brushingSchedule: ele.brushingSchedule.value,
        deodorant: ele.deodorant.value
      }
    }, this.props.token)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteChild() {
    this.props.deleteChild(this.state.code);
  }

  render() {
    // TODO: add links for more instructions or add text detailing everything
    // TODO: add dates and times for scheduling
    return (
      <div className="container">
        <h3>Preferences for Child</h3>
        <form onSubmit={this.routeUpdate.bind(this)}>
          <div className="form-group">
            <label htmlFor="childDescription">Child's Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="childDescription" 
              placeholder="Enter name" 
              value={this.state.childDescription} 
              onChange={this.updateChildDescription.bind(this)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="childCode">Child's Login Code</label>
            <input className="form-control" type="text" placeholder={this.state.code} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="isTeen">Age Category</label>
            <select 
              className="custom-select my-1 mr-sm-2" 
              id="isTeen"
              value={this.state.isTeen}
              onChange={this.updateIsTeen.bind(this)}
            >
              <option value={false}>5 - 11</option>
              <option value={true}>12 - 18</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="showerSchedule">Shower Schedule</label>
            <select 
              className="custom-select my-1 mr-sm-2" 
              id="showerSchedule"
              value={this.state.showerSchedule}
              onChange={(e) => this.setState({ showerSchedule: e.target.value })}
            >
              <option value="Daily">Daily</option>
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
              value={this.state.brushingSchedule}
              onChange={(e) => this.setState({ brushingSchedule: e.target.value })}
            >
              <option value="Once a day">Once a day</option>
              <option value="Twice a day">Twice a day</option>
              <option value="Three times a day">Three times a day</option>
              <option value="Once every two days">Once every two days</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="deodorant">Deodorant</label>
            <select 
              className="custom-select my-1 mr-sm-2" 
              id="deodorant"
              value={this.state.deodorant}
              onChange={(e) => this.setState({ deodorant: e.target.value })}
            >
              <option value="Never">Never</option>
              <option value="Once a day">Once a day</option>
              <option value="Twice a day">Twice a day</option>
              <option value="Once every two days">Once every two days</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
          <button className="btn btn-danger ml-3" onClick={this.deleteChild.bind(this)}>Delete</button>
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