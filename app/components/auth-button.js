import React from 'react';

import Icon from './icon';

import SBHSStore from '../stores/sbhs';
import NetworkStore from '../stores/network';

export default React.createClass({
  getData() {
    this.setState({
      online: NetworkStore.online,
      auth: !!SBHSStore.token
    });
  },

  getInitialState() {
    return {
      online: NetworkStore.online,
      auth: !!SBHSStore.token
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

    return this.state.auth ?
      <Icon
        style={{ 'margin': 'auto' }}
        icon="logout"
        onClick={() => {
          window['localStorage'].clear();
          window.location.href = '/auth/logout';
        }} /> :
      <Icon
        style={{ 'margin': 'auto' }}
        icon="login"
        onClick={() => {
          window.location.href = '/auth/login';
        }} />;
  }
});