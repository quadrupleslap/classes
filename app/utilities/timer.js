let timers = [];

//TODO: Not entirely convinced that this works.
setInterval(function () {
  let now = Date.now();

  for (let i = timers.length; i--;) {
    if (timers[i].date <= now) {
      timers[i].func(now);
      timers.splice(i, 1);
    }
  }
}, 1000);

export default function (func, date) {
  timers.push({
    func: func,
    date: date
  });
}