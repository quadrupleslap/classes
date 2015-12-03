import React from 'react';

import Today from './today';
import Timetable from './timetable';
import Notices from './notices';

import AuthButton from './auth-button';
import Tabs from './tabs';
import Icon from './icon';

function icon(name) { return <Icon style={{ 'margin': 'auto' }} icon={name} />; }

export default React.createClass({
  render() {
    let tabs = [
      {button: icon('timer'), content: <Today />},
      {button: icon('calendar'), content: <Timetable />},
      {button: icon('news'), content: <Notices />},
      {button: icon('settings'), content: 'Bow down to our lord and saviour the Helix!'},
      {},
      {button: <AuthButton />}];

    return <Tabs tabs={tabs} buttonStyle={{ height: '4em' }} width='4em' />;
  }
});

//TODO: Prevent overflow scrolling of body.