import React, {PropTypes} from 'react';

export default React.createClass({
  propTypes: {
    to: PropTypes.instanceOf(Date).isRequired
  },

  getInitialState() {
    return {
      text: null,
      timeoutID: null
    };
  },

  componentWillMount() {
    let tick = () => {
      let t = this.props.to - Date.now();

      let seconds = Math.floor( (t/1000) % 60 ),
          minutes = Math.floor( (t/(1000*60)) % 60 ),
          hours = Math.floor( t/(1000*60*60) );

      let numbers = [minutes, seconds];
      if (hours != 0)
        numbers.unshift(hours);

      this.setState({
        text: numbers.map(n => {
          let s = n.toString();
          let zeroes = 3 - s.length;
          return Array(zeroes > 0 && zeroes).join('0') + s;
        }).join(':'),
        timeoutID: window.setTimeout(tick, 1000)
      });
    };

    tick();
  },

  componentWillUnmount() {
    window.clearTimeout(this.state.timeoutID);
  },

  render() {
    let { to, ...props } = this.props;
    return <div {...props}>{this.state.text}</div>;
  }
});