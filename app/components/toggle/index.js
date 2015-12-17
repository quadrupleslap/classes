import React from 'react';

import STYLE from './style.css';

export default function (props) {
  return <div
    className={props.enabled ? STYLE.enabled : ''}
    style={{ 'width': 36, 'height': 14, 'position': 'relative' }}
    onClick={() => props.onChange(!props.enabled)}>
      <div className={STYLE.track} />
      <div className={STYLE.head} />
    </div>;
}