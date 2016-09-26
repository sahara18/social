import React, {Component} from 'react';
import vk from '@common/socials/vk';

export default class Newsfeed extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {count: 0};
  }

  async componentDidMount() {
    let data = await vk.send('wall.get', {owner_id: 144464216});
    this.setState({count: data.response.count});
  }

  render() {
    return (
      <div className="newsfeed">
        <h3>Newsfeed</h3>
        You have <b>{this.state.count}</b> posts
      </div>
    );
  }
}
