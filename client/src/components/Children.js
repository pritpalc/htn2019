import React from 'react';
import HygieneOptions from './HygieneOptions';

class Children extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      children: this.props.children // Children[], can be empty
    };
  }

  renderChildren() {
    if (this.props.children.length !== 0) {
      return this.props.children.forEach(child => {
        return <HygieneOptions />
      });
    }
  }

  addChild() {
    const defaultChild = {
      name: undefined,
      ageCategory: undefined,
      showerSchedule: undefined,
      brushingSchedule: undefined,
      deodorant: undefined
    };

    this.setState((prevState, props) => {
      let children = prevState.children;
      children.push(defaultChild);

      return {children: children};
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