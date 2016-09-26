import _ from 'lodash';

export let promisify = fn => (...args) => {
  return new Promise((resolve, reject) => {
    fn.apply(null, args.concat((err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    }));
  });
};

export let promisifyAll = obj => {
  return _.mapValues(obj, value => {
    return typeof value === 'function' ? promisify(value) : value;
  });
};
