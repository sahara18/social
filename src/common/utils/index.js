import _ from 'lodash';
import {connect} from 'react-redux';

export function inject(modules = []) {
  return connect(state => _.pick(state, modules), dispatch => ({dispatch}));
}
