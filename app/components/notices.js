import React from 'react';

import SBHSStore from '../stores/sbhs';
import Centered from './centered';
import Loader from './loader';
import Expandable from './expandable';

//TODO: What if notices is outdated? Huh...
//TODO: Year filter.
//TODO: Meeting options and stuff.
//TODO: Tell the user to log in if they aren't logged in instead of loading forever.
//TODO: Notices is completely broken because __innerHTML doesn't get mangled all too well.
export default React.createClass({
  getInitialState() {
    return {
      notices: null,
      date: null,

      refreshTimeoutID: null
    };
  },

  getData() {
    if (SBHSStore.notices) {
      this.setState({
        date: SBHSStore.notices.date,
        notices: SBHSStore.notices.notices
      });
    }
  },

  componentWillMount() {
    SBHSStore.bind('notices', this.getData);
    SBHSStore.bind('token', SBHSStore.fetchNotices);

    let refresh = () => {
      SBHSStore.fetchNotices();
      this.setState({
        refreshTimeoutID: window.setTimeout(refresh, (60 - new Date().getMinutes()) * 60 * 1000)
      });
    };

    this.getData();
    refresh();
  },

  componentWillUnmount() {
    SBHSStore.unbind('notices', this.getData);
    SBHSStore.unbind('token', SBHSStore.fetchNotices);

    window.clearTimeout(this.state.refreshTimeoutID);
  },

  render() {
    return this.state.notices?
      <Centered horizontal><div style={{
        'width': 'calc(100% - 16px)',
        'maxWidth': '1024px',
        'display': 'flex',
        'flexDirection': 'column',
        'alignItems': 'stretch',
        'boxSizing': 'border-box',
        'margin': '8px 0',
        'background': '#fff',
        'boxShadow': '0 2px 5px rgba(0,0,0,0.26)'
      }}>
        {this.state.notices.map((notice, i) =>
          //TODO: The index SHOULD NOT be the key. Find something unique.
          <Expandable
            style={{ 'padding': '1em', borderBottom: i != this.state.notices.length - 1 ? '1px solid #CCC' : null }}
            key={i}
            title={<div>
              <div style={{ 'fontSize': '1.2em' }}>{ notice.title }</div>
              <div style={{ 'fontSize': '0.8em', 'color': '#757575' }}>{ notice.author } | { notice.target }</div>
            </div>}
            content={<div dangerouslySetInnerHTML={{ __html: notice.content }} />} />)}
      </div></Centered> : <Centered vertical horizontal><Loader /></Centered>;
  }
});