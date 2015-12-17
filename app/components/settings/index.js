import React from 'react';

import Centered from '../centered';
import Toggle from '../toggle';

import SettingsStore from '../../stores/settings';

import STYLE from './style.css';

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

  clearAllData() {
    window['localStorage']['clear']();
    window['location']['reload']();
  },

  componentDidMount() {
    SettingsStore.bind('update', this.update);
  },

  componentWillUnmount() {
    SettingsStore.unbind('update', this.update);
  },

  render() {
    return <Centered vertical horizontal>
      <Toggle enabled={this.state.expandNotices} onChange={(newState) => SettingsStore.update({ expandNotices: newState })} />
      <select
        onChange={e => SettingsStore.update({ noticesFilter: e.target.value || null })}
        value={this.state.noticesFilter}
        className={STYLE.select} >
        <option value=''>All Years</option>
        <option value='7'>Year 7</option>
        <option value='8'>Year 8</option>
        <option value='9'>Year 9</option>
        <option value='10'>Year 10</option>
        <option value='11'>Year 11</option>
        <option value='12'>Year 12</option>
        <option value='Staff'>Staff</option>
      </select>
      <button onClick={this.clearAllData}>Clear All Data</button>
    </Centered>;
  }
});