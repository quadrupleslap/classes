import Emitter from '../utilities/emitter';

class NetworkStore extends Emitter {
  constructor() {
    super();
    this.online = window['navigator']['onLine'];
    window.addEventListener('online', () => window['location']['reload']());
    window.addEventListener('offline', () => this._goOffline());
  }

  _goOffline() {
    this.online = false;
    this.trigger('online');
  }
}

export default new NetworkStore();