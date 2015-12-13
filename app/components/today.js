import React from 'react';

import SBHSStore from '../stores/sbhs';
import Centered from './centered';
import Countdown from './countdown';
import Icon from './icon';
import Loader from './loader';

import parseTime from '../utilities/parse-time';

export default React.createClass({
  getInitialState() {
    return {
      bells: null,
      periods: null,
      date: null,

      nextTime: null,
      nextBell: null,

      timeout: null
    };
  },

  getData() {
    if (SBHSStore.today) {
      this.setState({
        bells: SBHSStore.today.bells,
        periods: SBHSStore.today.bells.filter(bell => bell.room),
        date: SBHSStore.today.date
      });
    }
  },

  loop() {
    let bells = this.state.bells;

    if (bells) {
      let date = new Date(this.state.date),
          now = Date.now();

      for (let i = 0; i < bells.length; i++) {
        let bell = bells[i];
        parseTime(date, bell.time);
        
        if (date > now) {
          return this.setState({
            nextBell: bell,
            nextTime: date,
            timeout: setTimeout(this.loop, date - now)
          });
        }
      }
    }

    this.setState({
      nextTime: null,
      nextBell: null,
      timeout: setTimeout(this.loop, 100)
    });
  },

  componentWillMount() {
    SBHSStore.bind('today', this.getData);
    this.getData();
    this.loop();
  },

  componentWillUnmount() {
    SBHSStore.unbind('today', this.getData);
    window.clearTimeout(this.state.timeout);
  },

  render() {
    const VARIATION_COLOR = '#00BFFF';

    let {periods, nextBell, nextTime} = this.state;

    return <Centered vertical horizontal>
      {nextBell? <div style={{ 'background': 'rgba(255,255,255,0.3)', 'width': '100%', 'textAlign': 'center', 'padding': '1em 0', 'color': '#000' }}>
        <span style={{ 'fontSize': '1.5em' }}>{ nextBell.title }</span> <span style={{ 'fontSize': '1em' }}>in</span>
        <Countdown to={nextTime} style={{ 'fontSize': '5em', 'fontWeight': '300' }} />
      </div> : <Loader />}

      {periods.length? <div style={{
        'width': 'calc(100% - 16px)',
        'maxWidth': '360px',
        'display': 'flex',
        'flexDirection': 'column',
        'boxShadow': '0 2px 5px rgba(0,0,0,0.26)',
        'margin': '8px',
        'background': '#FFF',
        'boxSizing': 'border-box'
      }}>
        {periods.map((bell, i) =>
          <div key={i} style={{
            'display': 'flex',
            'justifyContent': 'space-between',
            'alignItems': 'center',
            'borderBottom': i != periods.length - 1 ? '1px solid #CCC' : null,
            'padding': '16px'
          }}>
            <div>
              <div style={{
                'fontSize': '1.2em',
                'marginBottom': '8px',
                'color': bell.variations.indexOf('title') < 0 ? null : VARIATION_COLOR
              }}>{bell.title}</div>
              <div style={{
                'fontSize': '0.8em'
              }}>with <span style={{
                'color': bell.variations.indexOf('teacher') < 0 ? null : VARIATION_COLOR
              }}>{bell.teacher || 'no one'}</span></div>
            </div>
            <div style={{
                'fontSize': '1.5em',
                'color': bell.variations.indexOf('room') < 0 ? null : VARIATION_COLOR
              }}>{bell.room}
            </div>
          </div>)}
      </div> :null}
    </Centered>;
  }
});