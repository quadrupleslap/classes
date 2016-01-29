import React from 'react';

import Today from './today';
import Timetable from './timetable';
import Notices from './notices';
import Settings from './settings';

import AuthButton from './auth-button';
import Tabs from './tabs';
import Icon from './icon';

function button(icon, tooltip) {
  return <div
    style={{ 'margin': 'auto' }}
    title={tooltip}><Icon
      style={{ 'cursor': 'pointer' }}
      icon={icon} /></div>;
}

export default React.createClass({
  render() {
    let tabs = [
      {button: button('timer', 'Today'), content: <Today />},
      {button: button('calendar', 'Timetable'), content: <Timetable />},
      {button: button('news', 'Daily Notices'), content: <Notices />},
      {button: button('settings', 'Settings'), content: <Settings />},
      {},
      {button: <AuthButton />}];

    return <Tabs tabs={tabs} />;
  }
});

//TODO: Prevent overflow scrolling of body. And add overflow-scrolling to other stuff.