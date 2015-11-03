import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/app';

ReactDOM.render(<App />, document.getElementById('app'));

//TODO: Put this somewhere better. And fix overflow scrolling if this doesn't do it.
let elem = document.body;
elem.addEventListener('touchstart', e => {
  startY = event.touches[0].pageY;
  startTopScroll = elem.scrollTop;

  if(startTopScroll <= 0)
    elem.scrollTop = 1;

  if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
    elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
});