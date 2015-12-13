import React from 'react';

import SBHSStore from '../stores/sbhs';

import SBHSException from './sbhs-exception';
import Centered from './centered';
import Loader from './loader';
import Expandable from './expandable';

//TODO: What if notices is outdated? Huh...
//TODO: Meeting options and stuff.
//TODO: Tell the user to log in if they aren't logged in instead of loading forever.
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default React.createClass({
  getInitialState() {
    return {
      notices: null,
      date: null,
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
    this.getData();
  },

  componentWillUnmount() {
    SBHSStore.unbind('notices', this.getData);
  },

  render() {
    if (!this.state.notices)
      return <Centered vertical horizontal>
        <SBHSException
          loading={<Loader />}
          loggedOut='Login to read the notices!'
          offline='Go online to read the notices!' />
      </Centered>;

    return <Centered horizontal><div style={{
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
        {this.state.notices.map((notice, i) => {
          let meeting;

          if (notice.meeting) {
            let meetingDate = new Date(notice.meeting.date);
            meeting = <span style={{ 'color': '#757575' }}>
              {` on ${WEEKDAYS[meetingDate.getDay()]} ${meetingDate.getDate()}` + ( notice.meeting.time? ', ' + notice.meeting.time : '' )}
            </span>;
          } else {
            meeting = null;
          }

          return <Expandable
            style={{ 'padding': '1em', borderBottom: i != this.state.notices.length - 1 ? '1px solid #CCC' : null }}
            key={i}
            title={<div>
              <div style={{ 'fontSize': '1.2em' }}>
                <span>{ notice.title }</span>
                {meeting}
              </div>
              <div style={{ 'fontSize': '0.8em', 'color': '#757575' }}>{ notice.author } | { notice.target }</div>
            </div>}
            content={<div dangerouslySetInnerHTML={{ __html: notice.content }} />} />
        })}
      </div></Centered>;
  }
});