import {Text} from "../components/ui/Text.tsx";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';

export const CalendarPage = () => {
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