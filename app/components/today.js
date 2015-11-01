import React from 'react';

import SBHSStore from '../stores/sbhs';
import Centered from './centered';
import Countdown from './countdown';
import Icon from './icon';
import Loader from './loader';

import parseTime from '../utilities/parse-time';

//TODO: What if `today` is outdated? Hmm...
//TODO: Add a notification if finalized is false.
export default React.createClass({
  getInitialState() {
    return {
      bells: [],
      periods: [],
      nextTime: null,
      nextBell: null,
      nextBellTimeoutID: null
    };
  },

  getData() {
    if (SBHSStore.today) {
      let bells = SBHSStore.today.bells;
      let periods = bells && bells.filter(bell => bell.room);

      window.clearTimeout(this.state.nextBellTimeoutID);

      let getNextBell = () => {
        if (bells) {
          let date = new Date(SBHSStore.today.date),
              now = Date.now();
          for (let i = 0; i < bells.length; i++) {
            let bell = bells[i];

            parseTime(date, bell.time);
            
            if (date > now) {
              return this.setState({
                nextBell: bell,
                nextTime: date,
                nextBellTimeoutID: setTimeout(getNextBell, date - Date.now())
              });
            }
          }
        }

        this.setState({
          nextTime: null,
          nextBell: null,
          nextBellTimeoutID: null
        });
      };

      getNextBell();

      this.setState({
        periods: periods,
        bells: bells
      });
    }
  },

  componentWillMount() {
    SBHSStore.bind('today', this.getData);
    this.getData();
  },

  componentWillUnmount() {
    SBHSStore.unbind('today', this.getData);
    window.clearTimeout(this.state.nextBellTimeoutID);
  },

  //TODO: DIV OVERLOAD!!!
  //TODO: Make sure periods change correctly, because it doesn't seem like they are.
  //TODO: Change variation highlighting colour if you want to.
  render() {
    const VARIATION_COLOR = '#00BFFF';

    let {periods, nextBell, nextTime} = this.state;

    return <Centered vertical horizontal>
      {nextBell? <div style={{ 'padding': '8px' }}>
        <span style={{ 'fontSize': '1.5em' }}>{ nextBell.title }</span> <span style={{ 'fontSize': '1em' }}>in</span>
        <Countdown to={nextTime} style={{ 'fontSize': periods.length? '5em' : '16vw', 'fontWeight': '300' }} />
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
              {bell.teacher? <div style={{
                'fontSize': '0.8em'
              }}>with <span style={{
                'color': bell.variations.indexOf('teacher') < 0 ? null : VARIATION_COLOR
              }}>{bell.teacher || 'no one'}</span></div> :null}
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