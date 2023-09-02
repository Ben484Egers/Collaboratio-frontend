"use client"
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";


function Calendar({events}) {
  return (
    <div className="calendar-wrapper">
        <div className="container">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventContent={renderEventContent}
            height={"85vh"}
        />
      </div>
    </div>
  );
}

// Custom render function
function renderEventContent(eventInfo) {
    const link = eventInfo.event._def.extendedProps.link;
    const isProject = link.includes('project');
    return (
      <Link href={link} className={`event-render-content ${isProject ? 'project-bg' : 'task-bg'}`}>
        <p>{eventInfo.event.title}</p>
      </Link>
    )
  }

export default Calendar;