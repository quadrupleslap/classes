import React from 'react';

import SBHSStore from '../stores/sbhs';
import Centered from './centered';
import Loader from './loader';
import Expandable from './expandable';

export default React.createClass({
  getInitialState() {
    let weekday = 'Monday', week = 'A';
    if (SBHSStore.today && SBHSStore.today.day) {
      let components = SBHSStore.today.day.split(' ');
      weekday = components[0];
      week = components[1];
    }

    //TODO: Roll forward from today.date if we have it instead of naively using it.
    //TODO: Loader and login request message and stuff liek that.

    return {
      days: null,

      weekday: weekday,
      week: week,

      refreshTimeoutID: null
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
    SBHSStore.bind('token', SBHSStore.fetchTimetable);

    let refresh = () => {
      SBHSStore.fetchTimetable();
      this.setState({
        refreshTimeoutID: window.setTimeout(refresh, (60 - new Date().getMinutes()) * 60 * 1000)
      });
    };

    this.getData();
    refresh();
  },

  componentWillUnmount() {
    SBHSStore.unbind('timetable', this.getData);
    SBHSStore.unbind('token', SBHSStore.fetchTimetable);

    window.clearTimeout(this.state.refreshTimeoutID);
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
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(weekday =>
            <div style={{
              'flex': '1 1 auto',
              'textAlign': 'center',
              'height': '48px',
              'lineHeight': '48px',
              'color': this.state.weekday == weekday? '#00BFFF' :undefined
            }} onClick={() => this.setState({ weekday: weekday })}>{weekday[0]}</div>)}
        </div>
        <div style={{ 'display': 'flex', 'width': '100%' }}>
          {['A', 'B', 'C'].map(week =>
            <div style={{
              'flex': '1 1 auto',
              'textAlign': 'center',
              'height': '48px',
              'lineHeight': '48px',
              'color': this.state.week == week? '#00BFFF' :undefined
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
        {periods.map((period, i) => //TODO: I shouldn't be the key here, either.
          <div key={i} style={{ //TODO: Put in 'Free' so that all days have the same height.
            'display': 'flex',
            'justifyContent': 'space-between',
            'alignItems': 'center',
            'borderBottom': i != periods.length - 1 ? '1px solid #CCC' : null,
            'padding': '16px'
          }}>
            <div style={{ 'fontSize': '1.2em' }}>{ period.title }</div>
            <div style={{ 'fontSize': '1.5em' }}>{ period.room }</div>
          </div>)}
      </div> :null}
    </Centered>;
  }
});