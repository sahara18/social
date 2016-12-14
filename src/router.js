import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, IndexRoute, Route} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import store from '@common/store';
import history from '@common/history';

import Layout from '@components/layout';
import Dashboard from '@components/dashboard';
import Wall from '@components/wall';

let appHistory = syncHistoryWithStore(history, store);

ReactDOM.render((
  <Provider store={store}>
    <Router history={appHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={Dashboard}/>
        <Route path="/wall" component={Wall}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));
