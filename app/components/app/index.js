import React from 'react';

import Today from '../today';
import Timetable from '../timetable';
import Notices from '../notices';
import Settings from '../settings';

import AuthButton from '../auth-button';
import Tabs from '../tabs';
import Icon from '../icon';

import STYLE from './style.css';

function button(icon, tooltip) {
  return <div className={STYLE.button} title={tooltip}>
      <Icon
        style={{ 'margin': 'auto' }}
        icon={icon} />
    </div>;
}

export default React.createClass({
  render() {
    let tabs = [
      {button: button('timer', 'Today'), content: <Today />},
      {button: button('calendar', 'Timetable'), content: <Timetable />},
      {button: button('news', 'Daily Notices'), content: <Notices />},
      {button: button('settings', 'Settings'), content: <Settings />},
      {},
      {button: <div className={STYLE.button}><AuthButton /></div>}];

    return <Tabs tabs={tabs} />;
  }
});
