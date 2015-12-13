import React, {PropTypes} from 'react';

import SBHSStore from '../stores/sbhs';
import NetworkStore from '../stores/network';

export default React.createClass({
  propTypes: {
    offline: PropTypes.node.isRequired,
    loggedOut: PropTypes.node.isRequired,
    loading: PropTypes.node.isRequired
  },

  getInitialState() {
    return {
      offline: !NetworkStore.online,
      loggedOut: SBHSStore.state == SBHSStore.LOGGED_OUT
    };
  },

  update() {
    return {
      offline: !NetworkStore.online,
      loggedOut: SBHSStore.state == SBHSStore.LOGGED_OUT
    };
  },

  componentWillMount() {
    SBHSStore.bind('token', this.update);
    NetworkStore.bind('online', this.update);
    this.update();
  },

  componentWillUnmount() {
    SBHSStore.unbind('token', this.update);
    NetworkStore.unbind('online', this.update);
  },

  render() {
    let msg = null;

    if (this.state.offline) {
      msg = this.props.offline;
    } else if (this.state.loggedOut) {
      msg = this.props.loggedOut;
    } else {
      msg = this.props.loading;
    }

    return <div>{msg}</div>;
  }
});