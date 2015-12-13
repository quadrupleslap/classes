export default function parseTime(date, time) {
  let [hours, minutes] = time.split(':');
  date.setHours(hours, minutes, 0, 0);
  return date;
}