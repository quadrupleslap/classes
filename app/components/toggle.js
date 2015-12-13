import React from 'react';

import Centered from './centered';
import Toggle from './toggle';

export default function (props) {
  return <div
    style={{ 'width': 36, 'height': 14, 'position': 'relative' }}
    onClick={() => props.onChange(!props.enabled)}>
      <div style={{
        'position': 'absolute',
        'height': '100%',
        'width': '100%',
        'borderRadius': 8,
        'opacity': props.enabled ? 0.5 : 0.4,
        'transition': 'background-color linear .08s',
        'backgroundColor': props.enabled ? '#00BFFF' : '#000000'
      }} />
      <div style={{
        'position': 'absolute',
        'top': -3,
        'height': 20,
        'width': 20,
        'borderRadius': '50%',
        'boxShadow':' 0 1px 5px 0 rgba(0, 0, 0, 0.6)',
        'transition': 'transform linear .08s, background-color linear .08s',
        'backgroundColor': props.enabled ? '#00BFFF' : '#FAFAFA',
        'transform': props.enabled ? 'translate(16px, 0)' : undefined
      }} />
    </div>;
}