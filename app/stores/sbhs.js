import Emitter from '../utilities/emitter';
import {get, jsonp} from '../utilities/request';
import parseTime from '../utilities/parse-time';

import defaultBells from '../data/default-bells';

//TODO: Namespace localStorage.

let localStorage = window['localStorage'];
let alert = window['alert'];

class SBHSStore extends Emitter {
  constructor() {
    super();

    this.token = null;
    this.notices = localStorage.notices ? JSON.parse(localStorage.notices) : null;
    this.timetable = localStorage.timetable ? JSON.parse(localStorage.timetable) : null;
    this.today = this._defaultToday();

    this.bind('token', () => {
      this._fetchToday();
      this._fetchNotices();
      this._fetchTimetable();
    });

    this.bind('today', () => {
      window.setTimeout(() => {
        this._fetchToday();
        this._fetchNotices();
      }, parseTime(
        new Date(this.today.date),
        this.today.bells[this.today.bells.length - 1].time) - Date.now());
    });

    window.setInterval(() => {
      this._fetchToday();
      this._fetchNotices();
    }, 15 * 60 * 1000); // 15 minutes.

    this._fetchToken();
  }

  _defaultToday() {
    let today = {
      date: new Date(),
      day: null,
      finalized: false
    };

    let bells;
    while (true) {
      bells = defaultBells(today.date);

      if (bells.length > 0) {
        if (parseTime(new Date(today.date), bells[bells.length - 1].time) > Date.now())
          break;
      }

      today.date.setTime(today.date.getTime() + (1 * 24 * 60 * 60 * 1000));
    }

    today.bells = bells.map(bell => {
      return {
        title: bell.bell.replace(/^(\d+)$/, 'Period $1'),
        time: bell.time,
        variations: []
      };
    });

    return today;
  }

  _fetchToken() {
    let done = (data) => {
      this.token = data['accessToken'];
      window.setTimeout(
        () => this._fetchToken(),
        data['expires'] - Date.now());
      this.trigger('token');
    };

    if (localStorage.token) {
      let data = JSON.parse(localStorage.token);
      if (data['expires'] > Date.now())
        return done(data);
    }

    get('/auth/token', (err, res) => {
      if (err) {
        // This cycle shall never start anew.
        this.token = null;
        return this.trigger('token');
      }

      localStorage.token = res;
      done(JSON.parse(res));
    });
  }

  _fetchToday() {
    if (this.token) {
      get(`https://student.sbhs.net.au/api/timetable/daytimetable.json?&access_token=${encodeURIComponent(this.token)}`, (err, objectString) => {
        if (err)
          return console.error(`Could not load day timetable. Error: ${err}. Data: ${objectString}`); //TODO: Snackbar.

        let data = JSON.parse(objectString);

        let periods = data['timetable']['timetable']['periods'];

        let bells = [], i = {};
        data['bells'].forEach(bell => {
          let id = bell['bell'];

          i[id] = bells.length;

          let subjectData;
          if (id in periods)
            subjectData = data['timetable']['subjects'][periods[id].year + periods[id].title];

          if (subjectData) {
            bells.push({
              title: subjectData['title'],
              time: bell.time,
              teacher: subjectData['fullTeacher'],
              room: periods[id]['room'],
              variations: []
            });
          } else {
            bells.push({
              title: bell['bellDisplay'],
              time: bell['time']
            });
          }
        });

        for (let key in data['roomVariations']) {
          let variation = data['roomVariations'][key];
          bells[i[variation['period']]].room = variation['roomTo'];
          bells[i[variation['period']]].variations.push('room');
        }
        for (let key in data['classVariations']) {
          let variation = data['classVariations'][key];
          if (variation['type'] !== 'novariation') {
            bells[i[variation['period']]].teacher = (variation['type'] === 'replacement') ? variation['casualSurname'] : null;
            bells[i[variation['period']]].variations.push('teacher');
          }
        }

        this.today = {
          date: new Date(data['date']),
          bells: bells,
          day: data['timetable']['timetable']['dayname'],
          finalized: data['shouldDisplayVariations']
        };

        this.trigger('today');
      });
    } else {
      get('https://student.sbhs.net.au/api/timetable/bells.json', (err, objectString) => {
        if (err)
          return console.error(`Could not load bells. Error: ${err}. Data: ${objectString}`); //TODO: Snackbar.

        let data = JSON.parse(objectString);

        this.today = {
          date: new Date(data['date']),
          bells: data['bells'].map(bell => {
            return {
              title: bell['bell'].replace(/^(\d+)$/, 'Period $1'),
              time: bell['time'],
              variations: data['bellsAltered'] ? ['time'] : []
            };
          }),
          day: data['day'] + ' ' + data['weekType']
        };

        this.trigger('today');
      });
    }
  }

  _fetchNotices() {
    if (this.token) {
      get(`https://student.sbhs.net.au/api/dailynews/list.json?access_token=${encodeURIComponent(this.token)}`, (err, objectString) => {
        if (err)
          return console.error(`Could not load notices. Error: ${err} Data: ${objectString}.`) //TODO: Snackbar.

        let data = JSON.parse(objectString);

        this.notices = {
          date: new Date(data['dayInfo']['date']),
          notices: data['notices'].sort((a, b) => (b['relativeWeight'] + b['isMeeting']) - (a['relativeWeight'] + a['isMeeting'])).map(notice => {
            return {
              title: notice['title'],
              content: notice['content'],
              author: notice['authorName'],

              target: notice['displayYears'],
              targetList: notice['years'],

              meeting: notice['isMeeting']? {
                date: new Date(notice['meetingDate']),
                time: notice['meetingTime']
              } :null
            };
          })
        };

        localStorage.notices = JSON.stringify(this.notices);
        this.trigger('notices');
      });
    }
  }

  _fetchTimetable() {
    if (this.token) {
      //TODO: Improve the parsing of this so all periods have the same length.
      get(`https://student.sbhs.net.au/api/timetable/timetable.json?access_token=${encodeURIComponent(this.token)}`, (err, objectString) => {
        if (err)
          return console.error(`Could not load timetable. Error: ${err}. Data: ${objectString}`); //TODO: Snackbar.

        let data = JSON.parse(objectString);

        let subjectIndex = {};

        let subjects = Object.keys(data['subjects'])
          .map(key => {
            let subject = data['subjects'][key];
            return {
              title: subject['title'],
              abbr: subject['year'] + subject['shortTitle'],
              subject: subject['subject'],
              teacher: subject['fullTeacher']
            };
        });

        let rawStudent = data['student'];
        let rawDays = data['days'];

        this.timetable = {
          student: {
            givenName: rawStudent['givenname'],
            surname: rawStudent['surname'],
            id: rawStudent['studentid'],
            year: rawStudent['year']
          },
          subjects: subjects,
          days: Object.keys(rawDays)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(key => {
              let periods = Object.keys(rawDays[key]['periods'])
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map(i => {
                  let rawPeriod = rawDays[key]['periods'][i];

                  let abbr = rawPeriod['year'] + rawPeriod['title'], j;
                  for (j = subjects.length; j--;)
                    if (abbr === subjects[j].abbr)
                      break;

                  return {
                    title: subjects[j].title,
                    room: rawPeriod['room'],
                    teacher: subjects[j].teacher
                  };
                });

              return {
                periods: periods,
                day: rawDays[key]['dayname']
              };
            })
        };

        localStorage.timetable = JSON.stringify(this.timetable);
        this.trigger('timetable');
      });
    }
  }
}

export default new SBHSStore();