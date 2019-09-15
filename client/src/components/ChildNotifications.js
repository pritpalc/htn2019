import React from 'react';
import { getAuthenticatedData, postAuthenticatedData } from '../utils';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faWindowClose } from '@fortawesome/free-solid-svg-icons';

class ChildNotifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };
    this.confirmNotification = this.confirmNotification.bind(this)
    this.ignoreNotification = this.ignoreNotification.bind(this)
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications() {
    getAuthenticatedData(`/api/child/notifications`, this.props.token)
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

  confirmNotification(notificationId) {
    return postAuthenticatedData('/api/child/notification/confirm',{notificationId}, this.props.token)
    .then(() => this.getNotifications())
  }
  ignoreNotification(notificationId) {
    return postAuthenticatedData('/api/child/notification/ignore',{notificationId}, this.props.token)
    .then(() => this.getNotifications())
  }

  renderNotifications() {
    return this.state.notifications.map(notification => {
      return (
        <a href="#" key={notification.sent._seconds} className="list-group-item list-group-item-action flex-column align-items-start mt-3 mb-3">
          <div className="d-flex w-100 justify-content-between">
            <small>{moment.unix(notification.sent._seconds).toString()}</small>
          </div>
          <p className="mb-1">{notification.task}</p>
          {(notification.confirmed || notification.ignored)?[
          <small>Confirmed? {notification.confirmed ? <FontAwesomeIcon icon={faCheckSquare} /> : ""}</small>,<br />,
          <small>Ignored? {notification.ignored ? <FontAwesomeIcon icon={faWindowClose} /> : ""}</small>]:<div>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button onClick={() => this.confirmNotification(notification.notificationId)} type="button" class="btn btn-primary">Confirm</button>
              <button onClick={() => this.ignoreNotification(notification.notificationId)} type="button" class="btn btn-danger">Ignore</button>
            </div>
          </div>}
        </a>
      );
    });
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

export default ChildNotifications;