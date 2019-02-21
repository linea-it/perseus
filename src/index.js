import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';

import App from './containers/App';

import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import './assets/css/App.css';

import registerServiceWorker from './registerServiceWorker';
const history = createHistory();

ReactDOM.render(
  <Router basename={process.env.REACT_APP_PUBLIC_URL} history={history}>
    <Route path={`${process.env.PUBLIC_URL}/`} component={App} />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
