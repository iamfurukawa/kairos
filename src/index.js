import React from 'react';
import ReactDOM from 'react-dom';

import RouteComponent from './components/routes';

import 'antd/dist/antd.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <RouteComponent />
  </React.StrictMode>,
  document.getElementById('root')
);

