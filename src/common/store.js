import {createStore, combineReducers, applyMiddleware} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import promise from 'redux-promise-middleware';
import history from '@common/history';

let reducer = combineReducers({
  routing: routerReducer
});
let middleware = applyMiddleware(routerMiddleware(history), promise());
let store = createStore(reducer, middleware);

export default store;
