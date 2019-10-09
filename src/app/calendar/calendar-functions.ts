import { Component, OnInit } from '@angular/core';


const event_status: any = {
  empty: {
    color: 'rgba(250, 250, 250, 1)'
  },
  event: {
    color: 'rgba(30,144,255,0.3)'
  },
  pre_event: {
    color: 'rgba(250, 250, 250, 1)',
  },
  past_event: {
    color: 'rgba(250, 250, 250, 1)',
  },
  after_workstop: {
    color: 'rgb(255,165,0)',
  },
  time_out: {
    color: 'rgba(255,165,0,0.3)',
  },
  before_workStart: {
    color: 'rgba(150,150,150,0.5)',
  },
  day_name: {
    color: 'orange',
  }

};

export default event_status;


export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function dateToString(date: Date): string {
  // date = new Date(date);
  var day = minTwoDigitsNumber(date.getDate());
  var monthIndex: string = minTwoDigitsNumber((date.getMonth() + 1));
  var year = date.getFullYear();
  const newString: string = year + '-' + monthIndex + '-' + day;
  // const newString = new Date(date);
  return newString;
}

export function minTwoDigitsNumber(variable: number): string {
  return (variable < 10 ? '0' : '') + variable;
}

export function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}

export function convert_hour_to_minutes(data: string): number {
  const variable: any[] = data.split(':');
  const result: number = (+variable[0]) * 60 + (+variable[1]);
  return result;
} // end function convert_hour_to_minutes();


export function next_event(event, workStop): number {
  if (typeof event !== 'undefined') {
    const nextevent = event.start;
    // console.log('NEXT EVENT: ', nextevent);
    return nextevent;
  }
  else {
    const nextevent = workStop;
    // console.log('NEXT EVENT: ', nextevent);
    return nextevent;
  }
}

export async function minutes_to_hour(min: number) {
  const hours = Math.floor( min / 60 );
  // let minutes: number = min % 60;
  const minutes = await minTwoDigitsNumber(min % 60);
  return hours + ':' + minutes;
}

export function getDayByDate(date: any): number{
  const day = new Date(date).getDay();
  return day;
}

export function weekday_name(_i: number): string{
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  return weekday[_i];
}


export async function json_day(openHours: any, daydate: string, dayEvents: any[], intervalTime, calendarStartTime: number, calendarStopTime: number, clientList: any[]) {
  // console.log('Godziny otwarcia: ', openHours[1].openFrom);
  let day_no = getDayByDate(daydate);

  // console.log(clientList); // tabela customers

  const workStart: number = await convert_hour_to_minutes(openHours[day_no].openFrom);
  // let cursor: number = await convert_hour_to_minutes(openHours[day_no].openFrom);
  let cursor: number = calendarStartTime - 60;
  
  const workStop: number = await convert_hour_to_minutes(openHours[day_no].openTo);
  const workTime: number = workStop - workStart;
  const dayStop: number = calendarStopTime + 60;
  await delay(0);
 
  const dayArray = new Array();
  const day_name = weekday_name(day_no);
  let array: any;
  array = {
    name: day_name,
    start: cursor,
    length: 30,
    color: event_status.day_name.color,
    type: 'day_name',
    date: daydate
  };
  dayArray.push(array);


  let event: any;
  event = dayEvents.shift();
 
  for (cursor; cursor < dayStop;) {
    // console.log('CURSOR VALUE: ', cursor);
    await delay(0);
    let array: any;
    const nextevent = await next_event(event, workStop);
    const time: string = await minutes_to_hour(cursor);
    const isOpen: boolean = openHours[day_no].isOpen;

    if ( typeof event !== 'undefined' && cursor + intervalTime > event.start && event.start - cursor > 0 && cursor < workStop && isOpen === true ) {
      const difference = event.start - cursor;
      // console.log( 'DIFFERENCE BEFORE EVENT: ', difference);
      array = {
        name: '',
        start: cursor,
        length: difference,
        nextevent: nextevent,
        color: event_status.pre_event.color,
        type: 'pre_event',
        date: daydate,
        time: time
      };
      cursor = cursor + difference;
    } else if ( typeof event !== 'undefined' && event.start <= cursor && isOpen === true ) {
      console.log('CALENDAR EVENT: ', event);
      const date = event.date;
      let color: string = event_status.event.color
      if ( event.status === 'time_out' ) {
        color = event_status.time_out.color
      };

      let clientName = clientList.find(x=>x._id == event.clientId).data.name; // wyszukiwanie imienia i nazwiska klienta z tabeli customers
      // console.log(clientName);

      array = {
        name: clientName,
        start: event.start,
        length: event.length,
        color: color,
        type: 'event',
        date: daydate,
        time: time
      };
      cursor = event.start + event.length;
      event = dayEvents.shift();
    } else if ( cursor % intervalTime !== 0 && cursor < workStop && isOpen === true ) {
      let difference: number;
      if ( cursor + intervalTime < nextevent ) {
        const modulo = cursor % intervalTime;
        difference = intervalTime - modulo;
      } else {
        difference = nextevent - cursor;
      }

      // console.log( 'DIFFERENCE PAST EVENT: ', difference);
      array = {
        name: '',
        start: cursor,
        length: difference,
        nextevent: nextevent,
        color: event_status.past_event.color,
        type: 'past_event',
        date: daydate,
        time: time
      };
      cursor = cursor + difference;
    } else {
      // console.log('W EMPTY CURSOR STATUS: ', cursor);
      // console.log('EMPTY EVENT: ', cursor);
      const cursor_value = cursor;
      let color: string;
      let type: string;
      if (cursor < workStart || cursor >= workStop || isOpen === false) {
        color = event_status.before_workStart.color;
        type = 'time_out';
      } else {
        color = event_status.empty.color;
        type = 'empty';
      }
      if (cursor + length > next_event(event, workStop) && workStop - cursor > 0 ) {
        length = workStop - cursor;
        cursor = cursor + intervalTime;
      } else {
        length = intervalTime;
        cursor = cursor + intervalTime;
      }
      array = {
        name: 'empty_' + cursor,
        start: cursor_value,
        length: length,
        nextevent: nextevent,
        color: color,
        type: type,
        date: daydate,
        time: time
      };
    }
    dayArray.push(array);
  }
  console.log('loading...');
  return dayArray;
}// end function json_day();

