import React from 'react';

import Icon from './icon';
import Loader from './loader';

import SBHSStore from '../stores/sbhs';
import NetworkStore from '../stores/network';

export default React.createClass({
  getData() {
    this.setState({
      online: NetworkStore.online,
      auth: SBHSStore.state
    });
  },

  getInitialState() {
    return {
      online: NetworkStore.online,
      auth: SBHSStore.state
    };
  },

  componentWillMount() {
    SBHSStore.bind('token', this.getData);
    NetworkStore.bind('online', this.getData);
  },

  componentWillUnmount() {
    SBHSStore.unbind('token', this.getData);
    NetworkStore.unbind('online', this.getData);
  },

  render() {
    if (!this.state.online)
      return <Icon style={{ 'margin': 'auto' }} icon="disconnected" />;

    switch (this.state.auth) {
      case SBHSStore.LOADING:
        return <Loader style={{
          width: 30,
          height: 30,
          margin: 'auto'
        }} />;

      case SBHSStore.LOGGED_IN:
        return <Icon
          style={{ 'margin': 'auto' }}
          icon="logout"
          onClick={() => {
            SBHSStore.clearCache();
            window.location.href = '/auth/logout';
          }} />;

      case SBHSStore.LOGGED_OUT:
        return <Icon
          style={{ 'margin': 'auto' }}
          icon="login"
          onClick={() => {
            window.location.href = '/auth/login';
          }} />;
    }
  }
});