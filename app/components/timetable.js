import React from 'react';

import SBHSStore from '../stores/sbhs';
import Centered from './centered';
import Loader from './loader';
import Expandable from './expandable';

const WEEKS = ['A', 'B', 'C'];
const MS_TO_WEEKS = 1/(1000 * 60 * 60 * 24 * 7);

export default React.createClass({
  getInitialState() {
    let weekday = 'Monday', week = 'A';
    if (SBHSStore.today && SBHSStore.today.day) {
      let components = SBHSStore.today.day.split(' ');
      weekday = components[0];
      // Test this.
      week = WEEKS[(WEEKS.indexOf(components[1]) + Math.floor(Date.now() * MS_TO_WEEKS) - Math.floor(SBHSStore.today.date * MS_TO_WEEKS)) % 3];
    }

    //TODO: Loader and login request message and stuff liek that.

    return {
      days: null,
      weekday: weekday,
      week: week
    };
  },

  getData() {
    if (SBHSStore.timetable)
      this.setState({
        days: SBHSStore.timetable.days
      });
  },

  componentWillMount() {
    SBHSStore.bind('timetable', this.getData);
    this.getData();
  },

  componentWillUnmount() {
    SBHSStore.unbind('timetable', this.getData);
  },

  render() {
    if (!this.state.days)
      return <Centered vertical horizontal><Loader /></Centered>;

    let day = this.state.weekday + ' ' + this.state.week, periods;
    if (this.state.days)
      for (let i = this.state.days.length; i--;) {
        if (this.state.days[i].day == day) {
          periods = this.state.days[i].periods;
          break;
        }
      }

    return <Centered horizontal vertical>
      <div style={{
          'width': 'calc(100% - 16px)',
          'maxWidth': '360px',
          'display': 'flex',
          'flexDirection': 'column',
          'boxShadow': '0 2px 5px rgba(0,0,0,0.26)',
          'margin': '8px',
          'background': '#212121',
          'color': '#FFF',
          'boxSizing': 'border-box',
          'fontSize': '16px'
        }}>
        <div style={{ 'display': 'flex', 'width': '100%' }}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((weekday, i) =>
            <div key={i} style={{
              'flex': '1 1 auto',
              'textAlign': 'center',
              'height': '48px',
              'lineHeight': '48px',
              'color': this.state.weekday == weekday? '#00BFFF' :null
            }} onClick={() => this.setState({ weekday: weekday })}>{weekday[0]}</div>)}
        </div>
        <div style={{ 'display': 'flex', 'width': '100%' }}>
          {['A', 'B', 'C'].map((week, i) =>
            <div key={i} style={{
              'flex': '1 1 auto',
              'textAlign': 'center',
              'height': '48px',
              'lineHeight': '48px',
              'color': this.state.week == week? '#00BFFF' :null
            }} onClick={() => this.setState({ week: week })}>{week}</div>)}
        </div>
      </div>

      {periods? <div style={{
        'width': 'calc(100% - 16px)',
        'maxWidth': '360px',
        'display': 'flex',
        'flexDirection': 'column',
        'boxShadow': '0 2px 5px rgba(0,0,0,0.26)',
        'margin': '8px',
        'background': '#FFF',
        'boxSizing': 'border-box'
      }}>
        {periods.map((period, i) => {
          return <div key={i} style={{
            'display': 'flex',
            'justifyContent': 'space-between',
            'alignItems': 'center',
            'height': '1.84em',
            'borderBottom': i < periods.length - 1 ? '1px solid #CCC' : null,
            'padding': '16px'
          }}>
            <div style={{ 'fontSize': '1.2em' }}>{ period.title || <em style={{ color: '#AAA' }}>Free</em> }</div>
            <div style={{ 'fontSize': '1.5em' }}>{ period.room  || "" }</div>
          </div>;
        })}
      </div> :null}
    </Centered>;
  }
});