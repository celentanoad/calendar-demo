import { useEffect } from 'react';
import {useState} from 'react';
import DatePicker from 'react-datepicker';
import {
    addCalendar,
    editCalendar,
    getCalendar,
    deleteCalendar
} from './services/requests';

const AddEvent = ({calendarEvent, edit, allCalendarEvents}) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [id, setId] = useState(null);
    const [allEvents, setAllEvents] = useState(allCalendarEvents);

    useEffect(() => {
        setTitle(calendarEvent.title);
        setStart(calendarEvent.start);
        setEnd(calendarEvent.end);
        setId(calendarEvent.id);
    },[calendarEvent.title, calendarEvent.start, calendarEvent.end, calendarEvent.id]);

 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !start || !end) return;
        if (start>end) alert('Invalid date: end date must be later than start date');
        const form = { id, start, end, title };
        if (!edit) await addCalendar(form);
        else await editCalendar(form);
        const response = await getCalendar();
        const events = response.data.map(e => {
            return {
                ...e,
                start: new Date(e.start),
                end: new Date(e.end)
            };
        });
        setAllEvents(events);
    };

    const handleTitleChange = e => setTitle(e.target.value);
    const handleStartChange = date => setStart(date);
    const handleEndChange = date => setEnd(date);
    const deleteEvent = async () => {
        await deleteCalendar(calendarEvent.id);
        const response = await getCalendar();
        const events = response.data.map(e => {
            return {
                ...e,
                start: new Date(e.start),
                end: new Date(e.end)
            };
        });
        setAllEvents(events);
    }

    return ( 
        <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input type="text" name="title>" value={title || ""} onChange={handleTitleChange} />
            <br />
            <label>Start</label>
            <DatePicker 
                showTimeSelect
                selected={start}
                onChange={handleStartChange}
            />
            <br />
            <label>End</label>
            <DatePicker 
                showTimeSelect
                selected={end}
                onChange={handleEndChange}
            />
            <button type="submit">Save Event</button>
            <button onClick={deleteEvent}>Delete</button>
        </form>
     );
}
 
export default AddEvent;