import React from 'react';
import STYLE from './style.css';

export default React.createClass({
  getInitialState() {
    return { selectedIndex: 0 };
  },

  render() {
    let buttons = this.props.tabs.map((tab, i) => {
      if (!this.props.tabs[i].button) // Assume it's a divider.
        return <li key={i} className={STYLE.divider} />;

      return <li
          key={i}
          className={STYLE.button}
          style={{ 'color': i == this.state.selectedIndex ? '#00BFFF' : null }}
          onClick={tab.content && () => this.setState({ selectedIndex: i })}>
          { tab.button }
        </li>;
    });

    return <div style={{ height: '100%' }}>
      <ul className={STYLE.nav}>{ buttons }</ul>
      <div className={STYLE.content}>{ this.props.tabs[this.state.selectedIndex].content }</div>
    </div>;
  }
});