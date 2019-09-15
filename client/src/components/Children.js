import React from 'react';
import HygieneOptions from './HygieneOptions';
import { getAuthenticatedData } from '../utils';

class Children extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      children: this.getChildren() || []
    };
  }

  getChildren() {
    getAuthenticatedData("/api/user/children", this.props.token)
      .then(response => {
        console.log(response);
        this.setState({
          children: JSON.parse(response)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderChildren() {
    if (this.state.children.length !== 0) {
      return this.state.children.map(child => {
        return (
          <HygieneOptions 
            key={child.code}
            childDescription={child.childDescription}
            isTeen={child.prefs.isTeen}
            showerSchedule={child.prefs.showerSchedule}
            brushingSchedule={child.prefs.brushingSchedule}
            deodorant={child.prefs.deodorant}
            token={this.props.token}
            deleteChild={this.deleteChild.bind(this)}
          />
        );
      });
    }
  }

  addChild() {
    const defaultChild = {
      code: this.createChildCode(),
      childDescription: undefined,
      prefs: {
        isTeen: undefined,
        showerSchedule: undefined,
        brushingSchedule: undefined,
        deodorant: undefined
      }
    };

    this.setState((prevState, props) => {
      let children = prevState.children;
      children.push(defaultChild);

      return {children: children};
    });
  }

  createChildCode() {
    return Math.floor(100000 + Math.random() * 900000)
  }

  deleteChild(childCode) {
    this.setState(prevState => {
      return prevState.children.filter(child => child.code !== childCode);
    });
  }

  render() {
    return (
      <div className="container">
        {this.renderChildren()}
        <div className="row justify-content-center">
          <button
            type="button"
            className="btn btn-primary m-3"
            onClick={this.addChild.bind(this)}
          >
            Add Child
          </button>
        </div>
      </div>
    );
  }
}

export default Children;