import Emitter from '../utilities/emitter';
import {get, jsonp} from '../utilities/request';


//TODO: SERIOUS REFACTOR URGENTLY NEEDED.
//TODO: Caching and other stuff.
class SBHSStore extends Emitter {
  constructor() {
    super();

    this.accessToken = null;
    this.today = null;
    this.notices = null;
    this.timetable = null;

    this._fetchToken();
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  _fetchToken() {
    get('/auth/token', (err, res) => {
      if (!err) {
        let data = JSON.parse(res);
        this.accessToken = data['accessToken'];
        window.setTimeout(
          () => this._fetchToken(),
          data['expires'] - Date.now());
        this.trigger('token');
      } else if (this.accessToken) {
        this.accessToken = null;
        this.trigger('token');
      }
    });
  }

  //TODO: If two are running at once stop the first one, for all these functions.
  // Otherwise you get a glitch where sometimes bells.json loads after daytimetable.json, and it gets rid of everything.
  //TODO: Error handling. At least notify the users that something bad has happened.
  fetchToday() {
    if (!this.accessToken) {
      jsonp('https://student.sbhs.net.au/api/timetable/bells.json?callback=?&',
        (data) => {
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
    } else {
      jsonp('https://student.sbhs.net.au/api/timetable/daytimetable.json?callback=?&access_token='
        + encodeURIComponent(this.accessToken),
        (data) => {
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
    }
  }

  fetchNotices() {
    if (this.accessToken) {
      jsonp('https://student.sbhs.net.au/api/dailynews/list.json?callback=?&access_token='
        + encodeURIComponent(this.accessToken),
        (data) => {
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

          this.trigger('notices');
        });
    }
  }

  fetchTimetable() {
    if (this.accessToken) {
      jsonp('https://student.sbhs.net.au/api/timetable/timetable.json?callback=?&access_token='
        + encodeURIComponent(this.accessToken),
        (data) => {
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

          this.trigger('timetable');
        });
    }
  }
}

let store = new SBHSStore();

export default store;