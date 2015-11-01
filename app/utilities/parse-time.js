export default function parseTime(date, time) {
  let [hours, minutes] = time.split(':');
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date;
}