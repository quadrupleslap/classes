import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/app';

ReactDOM.render(<App />, document.getElementById('app'));

//TODO: Put this somewhere better. And fix overflow scrolling if this doesn't do it.
document.addEventListener('touchmove', e => e.preventDefault());