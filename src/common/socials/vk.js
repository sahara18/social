import url from 'url';
import axios from 'axios';
import {push} from 'react-router-redux';
import {ipcRenderer} from 'electron';
import store from '@common/store';

let vk = {
  setToken(token) {
    this.token = token;
    store.dispatch(push('/feed'));
  },

  auth() {
    ipcRenderer.send('vk auth');
  },

  async send(method, params = {}) {
    let uri = url.format({
      pathname: `https://api.vk.com/method/${method}`,
      query: {
        ...params,
        access_token: this.token,
        v: 5.53
      }
    });

    let {data} = await axios.get(uri);
    return data;
  }
};

ipcRenderer.on('vk auth', (e, accessToken) => {
  vk.setToken(accessToken);
});

export default vk;
