import React from 'react';

import Centered from './centered';
import Toggle from './toggle';
import Select from './select';

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
      <br />
      <Select
        onChange={e => SettingsStore.update({ noticesFilter: e.target.value || null })}
        value={this.state.noticesFilter}
        style={{ 'width': 128 }}
        items={[
          { label: 'All Years', value: '' },
          { label: 'Year 7',  value: '7' },
          { label: 'Year 8',  value: '8' },
          { label: 'Year 9',  value: '9' },
          { label: 'Year 10', value: '10' },
          { label: 'Year 11', value: '11' },
          { label: 'Year 12', value: '12' },
          { label: 'Staff', value: 'Staff' }
        ]} />
    </Centered>;
  }
});