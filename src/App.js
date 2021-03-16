import {useEffect, useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-datepicker/dist/react-datepicker.css";
// import events from './events';
import AddEvent from './AddEvent';
import {getCalendar} from './services/requests';

const localizer = momentLocalizer(moment);


function App() {
  const [calendarEvent, setCalendarEvent] = useState({});
  const [allCalendarEvents, setAllCalendarEvents] = useState([]);

  const getCalendarEvents = async () => {
    const response = await getCalendar();
    const events = response.data.map(e => {
      return {
        ...e,
        start: new Date(e.start),
        end: new Date(e.end)
      };
    });
    setAllCalendarEvents(events);
  }

  const handleSelect = (event, e) => {
    const {start, end} = event;
    const data = {title: '', start, end, allDay: false};
    setCalendarEvent(data);
  }

  const handleSelectEvent = (event, e) => {
    let { id, title, start, end, allDay } = event;
    start = new Date(start);
    end = new Date(end);
    const data = {id, start, end, title, allDay};
    setCalendarEvent(data);
  }

  useEffect(() => {
    getCalendarEvents();
  }, []);

  return (
    <div>
      <h1>Calendar</h1>
      <Calendar 
         localizer={localizer}
         events={allCalendarEvents}
         startAccessor="start"
         endAccessor="end"
         style={{ height: 500 }}
         selectable={true}
         onSelectSlot={handleSelect}
         onSelectEvent={handleSelectEvent}
      />
      <br />

      <h2>Add Calendar Event</h2>
      <AddEvent 
        edit={false}
        calendarEvent={calendarEvent}
        allCalendarEvents={allCalendarEvents}
      />
    </div>
  );
}

export default App;
