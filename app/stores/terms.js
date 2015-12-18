import Emitter from '../utilities/emitter';
import {get} from '../utilities/request';

let localStorage = window['localStorage'];

//TODO: Factor out the 3:15pm assumption.
//TODO: Put all assumptions in one file.
//TODO: Holidays.
const WEEKS = ['A', 'B', 'C'];

function processTerms(rawTerms) {
  return Object.keys(rawTerms).map(i => {
    let rawTerm = rawTerms[i];

    return {
      start: +new Date(rawTerm['start']['date']),
      end: +new Date(rawTerm['end']['date']),
      offset: WEEKS.indexOf(rawTerm['start']['weekType'])
    }
  }).sort((a, b) => a.start - b.start);
}

class TermsStore extends Emitter {
  constructor() {
    super();

    //TODO: Remove when update rates are high enough.
    try {
      this.terms = null;
      if (localStorage.terms) {
        let terms = JSON.parse(localStorage.terms);

        let lastDay = new Date(terms[terms.length - 1].end);
        lastDay.setHours(15, 15);

        if (lastDay > Date.now()) {
          this.terms = terms;
          return;
        }
      }
    } catch (e) {
      console.error('Old terms cache.');
    }

    this.fetch();
  }

  storeTerms(terms) {
    this.terms = terms;
    localStorage.terms = JSON.stringify(terms);

    let lastDay = new Date(terms[terms.length - 1].end);
    lastDay.setHours(15, 15);

    let timeToYearEnd = lastDay - Date.now();
    setTimeout(() => this.fetch(), timeToYearEnd);

    this.trigger('terms');
  }

  fetch() {
    let year = new Date().getFullYear();

    get(`https://student.sbhs.net.au/api/calendar/terms.json?year=${year}`, (err, res) => {
      if (err)
        return console.error(`Could not load terms. Error: ${err}. Data: ${res}`);

      let terms = processTerms(JSON.parse(res)['terms']);

      let lastDay = new Date(terms[terms.length - 1].end);
      lastDay.setHours(15, 15);

      if (lastDay > Date.now()) {
        this.storeTerms(terms);
      } else {
        get(`https://student.sbhs.net.au/api/calendar/terms.json?year=${year + 1}`, (err, res) => {
          if (err)
            return console.error(`Could not load terms. Error: ${err}. Data: ${res}`);

          this.storeTerms(processTerms(JSON.parse(res)['terms']));
        });
      }
    });
  }
}

export default new TermsStore();