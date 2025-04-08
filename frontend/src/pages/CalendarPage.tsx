import {Text} from "../components/ui/Text.tsx";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import {useEffect, useState} from "react";

export const CalendarPage = () => {
    const [timetable, setTimetable] = useState([]);

    //REMOVE THIS LATER
    console.log(timetable);
    //REMOVE THIS LATER

    useEffect(() => {
        const URL = import.meta.env.VITE_URL + "school/timetable/1";

        fetch(URL, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json().then((data)=>{
            setTimetable(data);
        }))
    }, []);

    return <main className="p-5 lg:p-0 lg:px-[5vw] lg:pt-10">
        <Text type={'h3'}>
            Calendar
        </Text>
        <FullCalendar
            plugins={[ dayGridPlugin,  timeGridPlugin,]}
            initialView="timeGridWeek"
            weekends={false}
            events={[
                { title: 'event 1', date: '2025-04-08' },
                { title: 'event 2', date: '2025-04-09' }
            ]}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'timeGridWeek,dayGridMonth'
            }}
            height={750}
        />
    </main>
}