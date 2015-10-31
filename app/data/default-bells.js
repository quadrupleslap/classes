const DEFAULT_BELLS = [[
    {bell:'Roll Call', time:'09:00'},
    {bell:'1', time:'09:05'},
    {bell:'Transition', time:'10:05'},
    {bell:'2', time:'10:10'},
    {bell:'Lunch 1', time:'11:10'},
    {bell:'Lunch 2', time:'11:30'},
    {bell:'3', time:'11:50'},
    {bell:'Transition', time:'12:50'},
    {bell:'4', time:'12:55'},
    {bell:'Recess', time:'13:55'},
    {bell:'5', time:'14:15'},
    {bell:'End of Day', time:'15:15'}
  ], [
    {bell:'Roll Call', time:'09:00'},
    {bell:'1', time:'09:05'},
    {bell:'Transition', time:'10:05'},
    {bell:'2', time:'10:10'},
    {bell:'Recess', time:'11:10'},
    {bell:'3', time:'11:30'},
    {bell:'Lunch 1', time:'12:30'},
    {bell:'Lunch 2', time:'12:50'},
    {bell:'4', time:'13:10'},
    {bell:'Transition', time:'14:10'},
    {bell:'5', time:'14:15'},
    {bell:'End of Day', time:'15:15'}
  ], [
    {bell:'Roll Call', time:'09:25'},
    {bell:'1', time:'09:30'},
    {bell:'Transition', time:'10:25'},
    {bell:'2', time:'10:30'},
    {bell:'Recess', time:'11:25'},
    {bell:'3', time:'11:45'},
    {bell:'Lunch 1', time:'12:40'},
    {bell:'Lunch 2', time:'13:00'},
    {bell:'4', time:'13:20'},
    {bell:'Transition', time:'14:15'},
    {bell:'5', time:'14:20'},
    {bell:'End of Day', time:'15:15'}
]];

export default function defaultBells(date) {
  switch (date.getDay()) {
    case 1:
    case 2:
      return DEFAULT_BELLS[0];
    case 3:
    case 4:
      return DEFAULT_BELLS[1];
    case 5:
      return DEFAULT_BELLS[2];
    default:
      return [];
  }
}