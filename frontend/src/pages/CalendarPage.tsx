import {Text} from "../components/ui/Text.tsx";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import {useEffect, useState} from "react";

type Course = {
    startTime: string,
    endTime: string,
    courseName: string
}

type Assignment = {
    startTime: string,
    endTime: string,
    name: string,
    category: string,
    courseName: string,
    date: string,
}



export const CalendarPage = () => {
    const [events, setEvents] = useState<Course[]|Assignment[]>([]);


    useEffect(() => {
        const URL = import.meta.env.VITE_URL + "school/timetable/1";

        fetch(URL, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json().then((data)=>{
            console.log(data)

            const newEvent = data.timetable.flatMap((dayOfTheWeek:Course[], index:number) => {
                return dayOfTheWeek.map(course => ({
                    title: course.courseName,
                    daysOfWeek: [index+1],
                    startTime: course.startTime,
                    endTime: course.endTime,
                    display: 'auto',
                }));
            });

            const newAssignmentsEvents = data.assignments.map((assignment: Assignment) => ({
                title: `${assignment.name} - ${assignment.category}`,
                start: `${assignment.date}T${assignment.startTime}`, // Combine date and start time
                end: `${assignment.date}T${assignment.endTime}`,     // Combine date and end time
                display: 'auto',
                color: '#bd1616', // Red color for assignments
            }));

            setEvents([...newEvent, ...newAssignmentsEvents]);
        }))
    }, []);

    return <main className="p-5 lg:p-0 lg:px-[5vw] lg:pt-10">
        <Text type={'h3'}>
            Calendar
        </Text>
        <FullCalendar
            plugins={[ timeGridPlugin,]}
            initialView="timeGridWeek"
            weekends={false}
            events={events}
            eventColor={'#3c1596'}
            hiddenDays={[6,7]}
            height={750}
            slotDuration={'00:20:00'}
            slotMinTime={'07:00:00'}
            slotMaxTime={'18:00:00'}
        />
    </main>
}