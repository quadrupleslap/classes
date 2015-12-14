import React from 'react';

import Centered from './centered';
import Toggle from './toggle';

import SettingsStore from '../stores/settings';

export default React.createClass({
  getInitialState() {
    return {
      expandNotices: SettingsStore.expandNotices,
      noticesFilter: SettingsStore.noticesFilter
    };
  },

  update() {
    this.setState({
      expandNotices: SettingsStore.expandNotices,
      noticesFilter: SettingsStore.noticesFilter
    });
  },

  componentDidMount() {
    SettingsStore.bind('update', this.update);
  },

  componentWillUnmount() {
    SettingsStore.unbind('update', this.update);
  },

  render() {
    return <Centered vertical horizontal>
      <p>Coming soon (like in the next few days)!</p>
      <p>Meanwhile, you can click this toggle button (which took ages to make):</p>
      <Toggle enabled={this.state.expandNotices} onChange={(newState) => SettingsStore.update({ expandNotices: newState })} />
      <input type="text" value={this.state.noticesFilter} placeholder="Empty = No Filter" onChange={e => SettingsStore.update({ noticesFilter: e.target.value || null })} />
    </Centered>;
  }
});