import React, { useState } from "react";
import CalendarEvent from "./CalendarEvent";
import { Button } from "react-bootstrap";

export interface ICalendarEvent {
    eventName: string;
    fromDate: string;
    toDate: string;
    fromTime: string;
    toTime: string;
    isAllDay: boolean;
    isCustom: boolean;
    repeatDays?: (
        | "Sunday"
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
    )[];
    isOn?: boolean;
    customEndDate?: string;
    isAfter?: boolean;
    customEndOccurrences?: number;
    address: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

export interface ICalendarData {
    events: ICalendarEvent[];
    displayNumber: number;
}

export default function CalendarForm({
    calendarData,
    setCalendarData,
    deleteComponent,
}: {
    calendarData: ICalendarData;
    setCalendarData: (newData: ICalendarData) => void;
    deleteComponent: () => void;
}) {
    const defaultEvent: ICalendarEvent = {
        eventName: "",
        fromDate: "",
        toDate: "",
        fromTime: "",
        toTime: "",
        isAllDay: false,
        isCustom: false,
        address: "",
        description: "",
        repeatDays: [],
        customEndDate: "",
        customEndOccurrences: 1,
        isOn: true,
        isAfter: false,
        buttonLink: "",
        buttonText: "",
    };

    // const [displayNumber, setDisplayNumber] = useState<number>(
    //     calendarData.displayNumber
    // );

    const setEvents = (callback) => {
        const prevEvents = [...calendarData.events];
        const updatedEvents = callback(prevEvents);
        setCalendarData({ ...calendarData, events: updatedEvents });
    };

    const setDisplayNumber = (newDisplayNumber) => {
        setCalendarData({ ...calendarData, displayNumber: newDisplayNumber });
    };

    const { events, displayNumber } = calendarData;

    const handleEventDataChange = (
        index: number,
        field: keyof ICalendarEvent,
        value: string | number | boolean | string[],
        additionalUpdates: Partial<ICalendarEvent> = {}
    ) => {
        setCalendarData({
            ...calendarData,
            events: events.map((event, i) =>
                i === index
                    ? { ...event, [field]: value, ...additionalUpdates }
                    : event
            )
        });
    };

    const handleDisplayNumberChange = (value: number) => {
        setDisplayNumber(value);
    };

    const handleAllDayUpdate = (index: number, isAllDay: boolean) => {
        setCalendarData({
            ...calendarData,
            events: events.map((event, i) =>
                i === index
                    ? {
                        ...event,
                        isAllDay,
                        fromTime: isAllDay ? "00:00" : "",
                        toTime: isAllDay ? "23:59" : "",
                    }
                    : event
            )
        });
    };

    const handleDelete = (index: number) => {
        setCalendarData({
            ...calendarData,
            events: events.filter((_, i) => i !== index)
        });
    };

    const handleAdd = (index: number) => {
        const newEventHandler = (prevEvents) => {
            const newEvents = [...prevEvents];
            const newEvent = { ...defaultEvent };

            if (index === newEvents.length - 1) {
                newEvents.push(newEvent);
            } else {
                newEvents.splice(index + 1, 0, newEvent);
            }
            return newEvents;
        };
        setCalendarData({
            ...calendarData,
            events: newEventHandler(events)
        });
    };

    const renderEvents = () => {
        return events.map((event, i) => (
            <CalendarEvent
                displayNumber={displayNumber}
                eventData={{ ...event }}
                index={i}
                key={i}
                handleEventDataChange={handleEventDataChange}
                handleDisplayNumberChange={handleDisplayNumberChange}
                handleAllDayUpdate={handleAllDayUpdate}
                handleDelete={handleDelete}
            />
        ));
    };

    return (
        <div
            style={{
                width: "100%",
                margin: "0px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {renderEvents()}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    onClick={() => handleAdd(events.length - 1)}
                    style={{
                        backgroundColor: "white",
                        color: "#226DFF",
                        fontWeight: "500",
                        letterSpacing: "-0.176px",
                        lineHeight: "150%",
                        fontSize: "1rem",
                        padding: "8px",
                        border: "border: 1px solid #226DFF",
                        width: "fit-content",
                    }}
                >
                    + Add event
                </Button>
                <button
                    type="button"
                    id="delete"
                    style={{
                        color: "red",
                        border: "1px solid red",
                        padding: "5px",
                        borderRadius: "4px",
                    }}
                    onClick={deleteComponent}
                >
                    Delete Component
                </button>
            </div>
            {/* <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify({ displayNumber, events }, null, 2)}</pre>
            </div> */}
        </div>
    );
}
