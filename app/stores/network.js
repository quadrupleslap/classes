import Emitter from '../utilities/emitter';

class NetworkStore extends Emitter {
  constructor() {
    super();
    this.online = window['navigator']['onLine'];

    window.addEventListener('online', () => {
      this.online = true;
      this.trigger('online');
    });

    window.addEventListener('offline', () => {
      this.online = false;
      this.trigger('online');
    });
  }
}

export default new NetworkStore();