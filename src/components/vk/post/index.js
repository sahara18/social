import React, {Component} from 'react';

export default class VKPost extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <div>Post</div>
        <pre>{JSON.stringify(this.props.post, null, 2)}</pre>
      </div>
    );
  }
}
