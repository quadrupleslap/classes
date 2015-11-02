import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/app';

ReactDOM.render(<App />, document.getElementById('app'));

//TODO: Clear cache on appcache update to avoid potential mangling conflicts.
//TODO: Fix overflow scrolling.