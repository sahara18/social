import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import store from '@common/store';
import history from '@common/history';

import Dashboard from '@components/dashboard';
import Newsfeed from '@components/newsfeed';

let appHistory = syncHistoryWithStore(history, store);

ReactDOM.render((
  <Provider store={store}>
    <Router history={appHistory}>
      <Route path="/" component={Dashboard}/>
      <Route path="/feed" component={Newsfeed}/>
    </Router>
  </Provider>
), document.getElementById('root'));
