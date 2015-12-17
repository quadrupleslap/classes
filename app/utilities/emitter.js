export default class Emitter {
  bind(event, fn){
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fn);
  }

  unbind(event, fn){
    this._events = this._events || {};

    if (!(event in this._events))
      return;

    this._events[event].splice(this._events[event].indexOf(fn), 1);
  }

  trigger(event){
    this._events = this._events || {};

    if (!(event in this._events))
      return;

    this._events[event].forEach(fn => fn());
  }
};