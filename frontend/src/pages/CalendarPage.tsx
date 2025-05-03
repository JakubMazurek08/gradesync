import { Text } from "../components/ui/Text.tsx";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button.tsx";
import {useUserStore} from "../stores/userStore.ts";
import {AddAssignmentPopup} from "../components/calendarPage/AddAssignmentPopup.tsx";

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
    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [addAssignmentDate, setAddAssignmentDate] = useState<string|null>(null)

    const {isTeacher} = useUserStore();

    const handlePlusClick = (date:Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        setAddAssignmentDate(formattedDate);
    };

    useEffect(() => {
        const URL = import.meta.env.VITE_URL + "assignment";

        fetch(URL, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json().then((data) => {
            const courseEvents = data.timetable.flatMap((dayOfTheWeek: Course[], index: number) => {
                return dayOfTheWeek.map(course => ({
                    title: course.courseName,
                    daysOfWeek: [index + 1],
                    startTime: course.startTime,
                    endTime: course.endTime,
                    display: 'auto',
                    color: '#3c1596',
                }));
            });

            const assignmentEvents = data.assignments.map((assignment: Assignment) => ({
                title: `${assignment.name} - ${assignment.category}`,
                start: `${assignment.date}T${assignment.startTime}`,
                end: `${assignment.date}T${assignment.endTime}`,
                display: 'auto',
                color: '#bd1616',
                type: 'assignment'
            }));

            setAllEvents([...courseEvents, ...assignmentEvents]);
        }))
    }, []);

    const filteredEvents = viewMode === 'week'
        ? allEvents
        : allEvents.filter(event => event.type === 'assignment');

    return (
        <>
        <main className="p-5 lg:p-0 lg:px-[5vw] lg:pt-10">
            <Text type={'h3'}>
                Calendar
            </Text>
            <div className="my-4">
                <Button size={'small'} onClick={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}>
                    Switch to {viewMode === 'week' ? 'Month' : 'Week'} View
                </Button>
            </div>
            <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin]}
                initialView={viewMode === 'week' ? 'timeGridWeek' : 'dayGridMonth'}
                weekends={false}
                hiddenDays={[6, 7]}
                height={750}
                slotDuration={'00:20:00'}
                slotMinTime={'07:00:00'}
                slotMaxTime={'18:00:00'}
                events={filteredEvents}
                eventColor={'#3c1596'}
                key={viewMode}
                dayCellDidMount={(info) => {
                    if(isTeacher){
                        const today = new Date();
                        const cellDate = new Date(info.date);

                        today.setHours(0, 0, 0, 0);
                        cellDate.setHours(0, 0, 0, 0);

                        if (info.view.type === 'dayGridMonth') {
                            if (cellDate >= today) {
                                const plusButton = document.createElement('button');
                                plusButton.textContent = '+';
                                plusButton.className = 'absolute bottom-1 right-1 w-4 h-6 text-white rounded-full flex items-center justify-center text-lg cursor-pointer';
                                plusButton.onclick = () => handlePlusClick(info.date);

                                info.el.appendChild(plusButton);
                            }
                        }
                    }
                }}
            />
        </main>
            {addAssignmentDate ?
                <AddAssignmentPopup addAssignmentDate={addAssignmentDate} setAddAssignmentDate={setAddAssignmentDate}/>
                : null}
        </>
    );
};
