import Emitter from '../utilities/emitter';
import {get} from '../utilities/request';

let localStorage = window['localStorage'];

// [[start_date, end_date], ...]
const WEEKS = ['A', 'B', 'C'];

class TermsStore extends Emitter {
  constructor() {
    super();

    let timeToNextYear = new Date((new Date).getFullYear() + 1, 0, 1) - Date.now();
    setTimeout(() => this.fetch(), timeToNextYear);

    this.terms = null;
    if (localStorage.terms) {
      let stored = JSON.parse(localStorage.terms);
      if (stored.year == new Date().getFullYear()) {
        this.terms = stored.terms;
        return;
      }
    }

    this.fetch();
  }

  fetch() {
    get('https://student.sbhs.net.au/api/calendar/terms.json', (err, res) => {
      if (err)
        return console.error(`Could not load terms. Error: ${err}. Data: ${res}`);

      let rawTerms = JSON.parse(res)['terms'];
      let terms = Object.keys(rawTerms).map(i => {
        let rawTerm = rawTerms[i];

        return {
          start: +new Date(rawTerm['start']['date']),
          end: +new Date(rawTerm['end']['date']),
          offset: WEEKS.indexOf(rawTerm['start']['weekType'])
        }
      }).sort((a, b) => a.start - b.start);

      this.terms = terms;

      localStorage.terms = JSON.stringify({
        terms: terms,
        year: new Date().getFullYear()
      });

      this.trigger('terms');
    });
  }
}

export default new TermsStore();