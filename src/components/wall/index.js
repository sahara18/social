import _ from 'lodash';
import pluralize from 'pluralize';
import React, {Component} from 'react';
import vk from '@common/socials/vk';

import VKPost from '@components/vk/post';

export default class Wall extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      count: 0,
      items: [],
      profiles: [],
      groups: []
    };
  }

  async componentDidMount() {
    let {response} = await vk.send('wall.get', {
      owner_id: 144464216,
      extended: 1
    });
    console.log(response);
    this.setState(_.pick(response, ['count', 'items', 'profiles', 'groups']));
  }

  render() {
    let {count, items} = this.state;
    let posts = items.map((post, key) => <VKPost post={post} key={key}/>);

    return (
      <div className="wall">
        <h5>Wall - {pluralize('post', count, true)}</h5>
        {posts}
      </div>
    );
  }
}
