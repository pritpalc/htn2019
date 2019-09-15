import React from 'react';
import { getAuthenticatedData } from '../utils';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faWindowClose } from '@fortawesome/free-solid-svg-icons';

class NotificationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications() {
    getAuthenticatedData(`/api/user/notifications`, this.props.token)
      .then(response => {
        console.log(response);
        this.setState({
          notifications: JSON.parse(response)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderNotifications() {
    return this.state.notifications.map(notification => {
      return (
        <a href="#" key={notification.sent._seconds} className="list-group-item list-group-item-action flex-column align-items-start mt-3 mb-3">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{this.getChildName(notification.child)}</h5>
            <small>{moment.unix(notification.sent._seconds).toString()}</small>
          </div>
          <p className="mb-1">{notification.task}</p>
          <small>Confirmed? {notification.confirmed ? <FontAwesomeIcon icon={faCheckSquare} /> : ""}</small><br />
          <small>Ignored? {notification.ignored ? <FontAwesomeIcon icon={faWindowClose} /> : ""}</small>
        </a>
      );
    });
  }

  getChildName(url) {
    const parts = url.split('/');
    const id = parts[parts.length - 1];

    let childName;
    this.props.children.forEach(child => {
      if (child.childId === id) {
        childName = child.childDescription;
      }
    });

    return childName;
  }

  render() {
    return (
      <div className="container">
        <div className="list-group">
          {this.renderNotifications()}
        </div>
        <button type="button" className="btn btn-secondary mt-3" onClick={this.props.closeModal}>Close</button>
      </div>
    );
  }
}

export default NotificationModal;