import React from 'react';

export default function (props) {
  return <div style={{
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': props.horizontal ? 'center' : null,
    'justifyContent': props.vertical ? 'center' : null,
    'height': '100%',
    'width': '100%'
  }} children={props.children} />;
}