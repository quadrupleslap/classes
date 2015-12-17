import React from 'react';

import SBHSStore from '../../stores/sbhs';

import Centered from '../centered';
import SBHSException from '../sbhs-exception';
import Loader from '../loader';
import Expandable from '../expandable';

import STYLE from './style.css';

export default React.createClass({
  getInitialState() {
    let weekday = 'Monday', week = 'A';
    if (SBHSStore.today && SBHSStore.today.day) {
      let components = SBHSStore.today.day.split(' ');
      weekday = components[0];
      week = components[1];
    }

    return {
      days: null,
      weekday: weekday,
      week: week
    };
  },

  getData() {
    this.setState({
      days: (SBHSStore.timetable || {}).days
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
      return <Centered vertical horizontal>
        <SBHSException
          loading={<Loader />}
          loggedOut='Login to load your timetable!'
          offline='Go online to load your timetable!' />
      </Centered>;

    let day = this.state.weekday + ' ' + this.state.week, periods;
    if (this.state.days)
      for (let i = this.state.days.length; i--;) {
        if (this.state.days[i].day == day) {
          periods = this.state.days[i].periods;
          break;
        }
      }

    return <Centered horizontal vertical>
      <div className={STYLE.controls}>
        <div className={STYLE.row}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((weekday, i) =>
            <div
              key={i}
              className={STYLE.control}
              style={{ 'color': this.state.weekday == weekday? '#00BFFF' :null }}
              onClick={() => this.setState({ weekday: weekday })}>
              {weekday[0]}
            </div>)}
        </div>
        <div className={STYLE.row}>
          {['A', 'B', 'C'].map((week, i) =>
            <div
              key={i}
              className={STYLE.control}
              style={{ 'color': this.state.week == week? '#00BFFF' :null }}
              onClick={() => this.setState({ week: week })}>
              {week}
            </div>)}
        </div>
      </div>

      {periods? <div className={STYLE.timetable}>
        {periods.map((period, i) => {
          return <div key={i} className={STYLE.period}>
            <div style={{ 'fontSize': '1.2em' }}>{ period.title || <em style={{ color: '#AAA' }}>Free</em> }</div>
            <div style={{ 'fontSize': '1.5em' }}>{ period.room  || '' }</div>
          </div>;
        })}
      </div> :null}
    </Centered>;
  }
});