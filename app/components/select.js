import React from 'react';

export default function (props) {
  let {style, items, ...elProps} = props;
  return <select {...elProps} style={{
    ...style,
    'margin': 0,
    'height': 34,
    'backgroundColor': '#FFF',
    'border': '1px solid #CCC',
    'borderRadius': 4,
    'boxShadow': 'inset 0 1px 1px rgba(0, 0, 0, .075)',
    'outline': 'none'
  }}>{
    items.map((item, i) => <option value={item.value} key={i}>{item.label}</option>)
  }</select>;
}