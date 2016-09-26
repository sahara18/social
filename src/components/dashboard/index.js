import React, {Component} from 'react';
import vk from '@common/socials/vk';

export default class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <h3>Dashboard</h3>
        <div className="socials-list">
          <a onClick={vk.auth} className="btn btn-link">
            <i className="fa fa-vk"/>
          </a>
        </div>
      </div>
    );
  }
}
