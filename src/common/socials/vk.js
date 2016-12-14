import url from 'url';
import {push} from 'react-router-redux';
import {ipcRenderer} from 'electron';
import store from '@common/store';

let vk = {
  setToken(token) {
    this.token = token;
    store.dispatch(push('/wall'));
  },

  auth() {
    ipcRenderer.send('VK_GET_TOKEN');
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

    let resp = await fetch(uri);
    let data = await resp.json();
    return data;
  }
};

ipcRenderer.on('VK_SET_TOKEN', (e, accessToken) => {
  vk.setToken(accessToken);
});

export default vk;
