import React from 'react';

import Today from './today';
import Timetable from './timetable';
import Notices from './notices';
import Tabs from './tabs';
import Icon from './icon';

function icon(name) { return <Icon style={{ margin: 'auto' }} icon={name} />; }

export default React.createClass({
  render() {
    let tabs = [
      {button: icon('timer'), content: <Today />, id: 'today'},
      {button: icon('calendar'), content: <Timetable />, id: 'timetable'},
      {button: icon('news'), content: <Notices />, id: 'notices'},
      {button: icon('settings'), content: 'Bow down to our lord and saviour the Helix!', id: 'settings'}];

    return <Tabs tabs={tabs} buttonStyle={{ height: '4em' }} width='4em' />;
  }
});