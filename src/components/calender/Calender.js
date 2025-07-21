import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useState } from 'react';

export default function MyCalendar() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Cuộc họp nhóm',
      start: '2025-05-22T09:00:00',
      end: '2025-05-22T10:00:00',
    },
  ]);

  const handleDateSelect = (selectInfo) => {
    const title = prompt('Nhập tiêu đề sự kiện:');
    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`Xóa sự kiện "${clickInfo.event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== clickInfo.event.id));
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      selectable={true}
      editable={true}
      events={events}
      select={handleDateSelect}
      eventClick={handleEventClick}
      slotMinTime="08:00:00"
      slotMaxTime="18:00:00"
    />
  );
}
