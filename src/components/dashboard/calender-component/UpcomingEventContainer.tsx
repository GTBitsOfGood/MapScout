import React from "react";
import UpcomingEvent from "./UpcomingEvent";
import { ICalendarData } from "./CalendarForm";

//larger the number the further secondDate is from the firstDate
const calculateDateDifference = (firstDate, secondDate) => {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    const difference = date2.getTime() - date1.getTime();
    return difference;
};

function countWeekdayOccurrences(
    startDate: Date,
    endDate: Date,
    weekdays: Array<
        | "Sunday"
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
    >
): number {
    const dayMapping: { [key: string]: number } = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    };

    if (startDate > endDate) {
        throw new Error(
            "The start date must be before or equal to the end date."
        );
    }

    const targetDayNumbers = weekdays.map((day) => dayMapping[day]);
    let count = 0;

    startDate = new Date(startDate);
    while (startDate <= endDate) {
        if (targetDayNumbers.includes(startDate.getDay())) {
            count++;
        }
        startDate.setDate(startDate.getDate() + 1);
    }

    return count;
}

const checkIfShouldFilterByCustom = (event, currentDate) => {
    if (event.isCustom) {
        if (event.isOn) {
            const customEndDate = event.customEndDate;
            const isPast =
                calculateDateDifference(currentDate, customEndDate) < 0
                    ? true
                    : false;
            return !isPast;
        } else if (event.isAfter) {
            const startDate = new Date(event.fromDate);
            currentDate = new Date(currentDate);
            const maxOccurrances = event.customEndOccurrences;
            const isUnderMaxOccurances =
                countWeekdayOccurrences(
                    startDate,
                    currentDate,
                    event.repeatDays
                ) < maxOccurrances
                    ? true
                    : false;
            return isUnderMaxOccurances;
        }
    }

    return false;
};

export default function UpcomingEventsContainer(calendarData: ICalendarData) {
    const date = new Date();
    const day = date.getDate();
    const dd = String(day).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0
    const yyyy = date.getFullYear();
    const currentDate = `${yyyy}-${mm}-${dd}`;

    const weekdays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ] = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const currentWeekdayName:
        | "Sunday"
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday" = weekdays[date.getDay()];

    let eventsArr = calendarData.events;

    //filters out events that are past the current date
    let filteredEvents = eventsArr.filter((event) => {
        const eventToDate = event.toDate;
        const timeDifference = calculateDateDifference(
            currentDate,
            eventToDate
        );
        if (timeDifference >= 0) {
            return true;
        } else {
            return false;
        }
    });

    filteredEvents = filteredEvents.filter((event) => {
        if (checkIfShouldFilterByCustom(event, currentDate)) {
            if (event.repeatDays.includes(currentWeekdayName)) {
                return true;
            }
            return false;
        } else if (event.isCustom) {
            if (
                calculateDateDifference(currentDate, event.customEndDate) <=
                    0 ||
                countWeekdayOccurrences(
                    new Date(event.fromDate),
                    new Date(currentDate),
                    event.repeatDays
                ) >= event.customEndOccurrences
            ) {
                return true;
            }
        } else if (event.isCustom === false) {
            return true;
        }
        return false;
    });

    //sorts events from closests to farthest event
    filteredEvents.sort((a, b) => {
        return calculateDateDifference(b.fromDate, a.fromDate);
    });
    //slices to show first {displayNumber} events
    filteredEvents = filteredEvents.slice(0, calendarData.displayNumber);

    return (
        <div style={{ width: "100%" }}>
            {filteredEvents.map((event) => {
                return <UpcomingEvent eventData={event} />;
            })}
        </div>
    );
}
