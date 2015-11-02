import Emitter from '../utilities/emitter';

class NetworkStore extends Emitter {
  constructor() {
    super();
    this.online = window['navigator']['onLine'];
    window.addEventListener('online', () => this._fetchStatus());
    window.addEventListener('offline', () => this._fetchStatus());
  }

  _fetchStatus() {
    this.online = window['navigator']['onLine'];
    this.trigger('online');
  }
}

export default new NetworkStore();