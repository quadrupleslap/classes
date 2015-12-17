import React from 'react';

import Today from './today';
import Timetable from './timetable';
import Notices from './notices';
import Settings from './settings';

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
      {button: icon('settings'), content: <Settings />},
      {},
      {button: <AuthButton />}];

    return <Tabs tabs={tabs} />;
  }
});

//TODO: Prevent overflow scrolling of body. And add overflow-scrolling to other stuff.