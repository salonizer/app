export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function convert_hour_to_minutes(data: string): number {
  const variable: any[] = data.split(':');
  const result: number = (+variable[0]) * 60 + (+variable[1]);
  return result;
} // end function convert_hour_to_minutes();

export function fake_array(): any {
  const fakeArray = new Array();
  let array = {
    name: 'itemek 1',
    start: 700,
    lenght: 40
  };
  fakeArray.push(array);
  array = {
    name: 'itemek 2',
    start: 900,
    lenght: 130
  };
  fakeArray.push(array);
  return fakeArray;
} // end function fake_array();


export async function json_day(day: any, intervalTime: number) {
  const workStart: number = await convert_hour_to_minutes(day.openFrom);
  let cursor: number = await convert_hour_to_minutes(day.openFrom);
  const workStop: number = await convert_hour_to_minutes(day.openTo);
  const workTime: number = workStop - workStart;
  const intervalsNumber: number = workTime / intervalTime;
  let fakeArray = new Array();
  fakeArray = await fake_array();
  await delay(200);
  console.log('FAKE ARRAY: ', fakeArray);
  // console.log('work_start: ', workStart);
  // console.log('work_stop: ', workStop);
  // console.log('work_time: ', workTime);
  // console.log('interval_number: ', intervalsNumber);

  const dayArray = new Array();
  let event: any;
  event = fakeArray.shift();
  // console.log('EVENT START: ', event.start);

  for (cursor; cursor < workStop; ) {
    console.log('CURSOR VALUE: ', cursor);
    await delay(200);
    let array: any;
    if ( typeof event !== 'undefined' && cursor + intervalTime > event.start && event.start - cursor > 0) {
      const difference = event.start - cursor;
      console.log( 'DIFFERENCE BEFORE EVENT: ', difference);
      array = {
        name: '',
        start: cursor,
        lenght: difference,
        color: 'brown'
      };
      cursor = cursor + difference;
    } else if ( typeof event !== 'undefined' && event.start <= cursor) {
      console.log('CALENDAR EVENT: ', cursor);
      array = {
        name: event.start,
        start: event.start,
        lenght: event.lenght,
        color: 'blue'
      };
      cursor = event.start + event.lenght;
      event = fakeArray.shift();
    } else if ( cursor % intervalTime !== 0 ) {
      const modulo = cursor % intervalTime;
      const difference = intervalTime - modulo;
      console.log( 'DIFFERENCE PAST EVENT: ', difference);
      array = {
        name: '',
        start: cursor,
        lenght: difference,
        color: 'teal'
      };
      cursor = cursor + difference;
    } else {
      console.log('EMPTY EVENT: ', cursor);
      array = {
        name: 'empty_' + cursor,
        start: cursor,
        lenght: 30,
        color: 'grey'
      };
      cursor = cursor + intervalTime;
    }
    dayArray.push(array);
  }

  return dayArray;
}// end function json_day();

