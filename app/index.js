import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/app';

document.addEventListener('load',
  () => ReactDOM.render(<App />, document.getElementById('app')));