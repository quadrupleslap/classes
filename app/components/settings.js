import React from 'react';

import Centered from './centered';
import Toggle from './toggle';

export default React.createClass({
  getInitialState() {
    return { enabled: false };
  },

  render() {
    return <Centered vertical horizontal>
      <p>Coming soon (like in the next few days)!</p>
      <p>Meanwhile, you can click this toggle button (which took ages to make):</p>
      <Toggle enabled={this.state.enabled} onChange={(newState) => this.setState({ enabled: newState })} />
    </Centered>;
  }
});