import React from 'react';
import STYLE from './style.css';

export default function (props) {
  return <div className={STYLE.loader} {...props}></div>;
}