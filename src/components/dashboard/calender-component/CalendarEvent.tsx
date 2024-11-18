import React, { useState, useEffect } from "react";
import { Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export default function CalendarEvent({
    index,
    displayNumber,
    eventData,
    handleEventDataChange,
    handleDisplayNumberChange,
    handleDelete,
    handleAdd,
    handleAllDayUpdate,
}) {
    const {
        eventName,
        fromDate,
        toDate,
        fromTime,
        toTime,
        isAllDay,
        isCustom,
        address,
        description,
        buttonText,
        buttonLink,
        repeatDays,
        customEndDate,
        customEndOccurrences,
        isOn,
        isAfter,
    } = eventData;

    const renderCustomRecurrance = () => {
        const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        const clickedObj = {};
        if (repeatDays) {
            repeatDays.forEach((day) => {
                clickedObj[day] = true;
            });
        }

        const [clickedDays, setClickedDays] = useState({
            Sunday: false,
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
            ...clickedObj,
        });

        const toggleDay = (day) => {
            const updatedClickedDays = {
                ...clickedDays,
                [day]: !clickedDays[day],
            };
            setClickedDays(updatedClickedDays);

            const updatedRepeatDaysArr = daysOfWeek.filter(
                (currDay) => updatedClickedDays[currDay]
            );

            handleEventDataChange(index, "repeatDays", updatedRepeatDaysArr);
        };
        if (isCustom) {
            return (
                <Form.Group>
                    <Form.Label>Custom Recurrence</Form.Label>
                    <Form.Group>
                        <Form.Label>Repeat on</Form.Label>
                        <Form.Group
                            style={{
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            {daysOfWeek.map((day, i) => (
                                <Button
                                    key={i}
                                    style={{
                                        backgroundColor: !repeatDays?.includes(
                                            day
                                        )
                                            ? "#F2F2F2"
                                            : "#226DFF",
                                        color: !repeatDays?.includes(day)
                                            ? "#828282"
                                            : "white",
                                        borderRadius: "25px",
                                        borderColor: "transparent",
                                        padding: "5px 10px",
                                        fontSize: "12px",
                                    }}
                                    onClick={() => toggleDay(day)}
                                >
                                    {day.charAt(0)}
                                </Button>
                            ))}
                        </Form.Group>
                    </Form.Group>
                    <Form.Label>Ends</Form.Label>
                    <Form.Group>
                        <Form.Group
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                maxWidth: "35%",
                            }}
                        >
                            <Form.Check
                                type="radio"
                                label="On"
                                name="endType"
                                checked={isOn}
                                onChange={() => {
                                    handleEventDataChange(index, "isOn", true);
                                    handleEventDataChange(
                                        index,
                                        "isAfter",
                                        false
                                    );
                                }}
                                id="endOn"
                            />
                            <InputGroup
                                style={{
                                    maxWidth: "200px",
                                }}
                            >
                                <Form.Control
                                    type="date"
                                    disabled={isAfter}
                                    value={customEndDate}
                                    onChange={(e) =>
                                        handleEventDataChange(
                                            index,
                                            "customEndDate",
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                maxWidth: "35%",
                            }}
                        >
                            <Form.Check
                                type="radio"
                                label="After"
                                checked={isAfter}
                                name="endType"
                                id="endAfter"
                                onChange={() => {
                                    handleEventDataChange(index, "isOn", false);
                                    handleEventDataChange(
                                        index,
                                        "isAfter",
                                        true
                                    );
                                }}
                            />
                            <InputGroup style={{ maxWidth: "200px" }}>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    disabled={isOn}
                                    value={customEndOccurrences}
                                    onChange={(e) =>
                                        handleEventDataChange(
                                            index,
                                            "customEndOccurrences",
                                            Number(
                                                (e.target as HTMLInputElement)
                                                    .value
                                            )
                                        )
                                    }
                                />
                                <InputGroup.Text>occurrences</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Form.Group>
                </Form.Group>
            );
        } else {
            return null;
        }
    };

    return (
        <div>
            <Form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    paddingBottom: "16px",
                }}
            >
                {index === 0 && (
                    <Form.Group
                        style={{
                            display: "flex",
                            gap: "24px",
                            alignItems: "center",
                            marginBottom: "0px",
                        }}
                    >
                        <Form.Label>Number of events to display:</Form.Label>
                        <Form.Control
                            type="number"
                            value={displayNumber}
                            max={10}
                            min={1}
                            onChange={(e) => {
                                const num = Number(
                                    (e.target as HTMLInputElement).value
                                );
                                if (num > 10 || num < 1) return;
                                handleDisplayNumberChange(num);
                            }}
                            style={{
                                paddingLeft: "10px",
                                maxWidth: "60px",
                                paddingRight: "10px",
                            }}
                        />
                    </Form.Group>
                )}

                <Form.Text
                    style={{
                        color: "#333",
                        fontSize: "1rem",
                        fontWeight: "bold",
                    }}
                >{`Event ${index + 1}`}</Form.Text>

                <Form.Group style={{ margin: "0px", maxWidth: "50%" }}>
                    <Form.Label>
                        Event name <span style={{ color: "#EB5757" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={eventName}
                        onChange={(e) =>
                            handleEventDataChange(
                                index,
                                "eventName",
                                (e.target as HTMLInputElement).value
                            )
                        }
                        style={{ borderColor: "#D9D9D9" }}
                        required
                    />
                </Form.Group>

                {/*
                Event Duration
                 */}
                <Form.Group style={{ margin: "0px", width: "80%" }}>
                    <Form.Label>
                        Event Duration
                        <span style={{ color: "#EB5757" }}>*</span>
                    </Form.Label>
                    <Form.Group
                        style={{
                            display: "flex",
                            gap: "8px",
                            maxWidth: "80%",
                        }}
                    >
                        <Form.Control
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                handleEventDataChange(
                                    index,
                                    "fromDate",
                                    (e.target as HTMLInputElement).value
                                )
                            }
                            style={{ borderColor: "#D9D9D9", maxWidth: "30%" }}
                            required
                        />
                        {!isAllDay && (
                            <Form.Control
                                type="time"
                                value={fromTime !== "" ? fromTime : "0:00"}
                                onChange={(e) => {
                                    handleEventDataChange(
                                        index,
                                        "fromTime",
                                        (e.target as HTMLInputElement).value
                                    );
                                }}
                                style={{ borderColor: "#D9D9D9" }}
                                required
                            />
                        )}
                        to
                        <Form.Control
                            type="date"
                            value={toDate}
                            onChange={(e) =>
                                handleEventDataChange(
                                    index,
                                    "toDate",
                                    (e.target as HTMLInputElement).value
                                )
                            }
                            style={{ borderColor: "#D9D9D9", maxWidth: "30%" }}
                            required
                        />
                        {!isAllDay && (
                            <Form.Control
                                type="time"
                                placeholder="00:00"
                                value={toTime}
                                onChange={(e) =>
                                    handleEventDataChange(
                                        index,
                                        "toTime",
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                                style={{ borderColor: "#D9D9D9" }}
                                required
                            />
                        )}
                    </Form.Group>

                    {/*
                    Checkboxes
                     */}
                    <Form.Group>
                        <Form.Check
                            inline
                            label="All day"
                            type="checkbox"
                            checked={isAllDay}
                            onChange={(e) => {
                                handleAllDayUpdate(index, e.target.checked);
                            }}
                            style={{ borderColor: "#D9D9D9" }}
                        />

                        <Form.Check
                            inline
                            label="Custom"
                            type="checkbox"
                            checked={isCustom}
                            onChange={(e) => {
                                handleEventDataChange(
                                    index,
                                    "isCustom",
                                    e.target.checked
                                );
                            }}
                            style={{ borderColor: "#D9D9D9" }}
                        />
                    </Form.Group>
                </Form.Group>

                {renderCustomRecurrance()}

                <Form.Group style={{ margin: "0px" }}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={address}
                        onChange={(e) =>
                            handleEventDataChange(
                                index,
                                "address",
                                (e.target as HTMLInputElement).value
                            )
                        }
                        style={{ borderColor: "#D9D9D9" }}
                    />
                </Form.Group>

                <Form.Group style={{ margin: "0px" }}>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        as="textarea"
                        placeholder="Description text"
                        value={description}
                        onChange={(e) =>
                            handleEventDataChange(
                                index,
                                "description",
                                (e.target as HTMLInputElement).value
                            )
                        }
                        style={{ borderColor: "#D9D9D9", height: "148px" }}
                    />
                </Form.Group>

                <Form.Group
                    style={{
                        display: "flex",
                        width: "100%",
                        gap: "1rem", // Optional: Adds spacing between the items
                    }}
                >
                    <Form.Group style={{ flex: 1 }}>
                        <Form.Label>Button text (optional)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="RSVP"
                            value={buttonText}
                            onChange={(e) =>
                                handleEventDataChange(
                                    index,
                                    "buttonText",
                                    (e.target as HTMLInputElement).value
                                )
                            }
                            style={{ borderColor: "#D9D9D9", width: "100%" }}
                        />
                    </Form.Group>

                    <Form.Group style={{ flex: 1 }}>
                        <Form.Label>Button link (optional)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="https://example.com"
                            value={buttonLink}
                            onChange={(e) =>
                                handleEventDataChange(
                                    index,
                                    "buttonLink",
                                    (e.target as HTMLInputElement).value
                                )
                            }
                            style={{ borderColor: "#D9D9D9", width: "100%" }}
                        />
                    </Form.Group>
                </Form.Group>
            </Form>
            <div
                style={{
                    marginBottom: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button
                        onClick={() => handleDelete(index)}
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            color: "#4F4F4F",
                        }}
                    >
                        Delete
                    </Button>
                </div>
                {/* <Button
                    onClick={() => handleAdd(index)}
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
                </Button> */}
            </div>
        </div>
    );
}
