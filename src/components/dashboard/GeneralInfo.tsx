import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaRegClock } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { SlGlobe } from "react-icons/sl";
import { TbPlaystationCircle } from "react-icons/tb";

export default function GeneralInfo(props) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const infoStyle = {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    };

    const iconStyle = {
        marginRight: "20px",
        verticalAlign: "middle",
        color: "#226DFF",
    };

    function calculateHours(props) {
        const rows = [];
        const startandFinish = [0]; // In pairs, keep track of the starting and ending days with same time
        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];
        const abbrevDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        for (let i = 1; i < 7; i++) {
            // not both undefined
            if (props.item.hours[days[i]] !== props.item.hours[days[i - 1]]) {
                if (
                    !props.item.hours[days[i]] ||
                    !props.item.hours[days[i - 1]] ||
                    props.item.hours[days[i]][0] !==
                    props.item.hours[days[i - 1]][0] ||
                    props.item.hours[days[i]][1] !==
                    props.item.hours[days[i - 1]][1]
                ) {
                    startandFinish.push(i - 1);
                    startandFinish.push(i);
                }
            }
            if (i === 6) {
                startandFinish.push(6);
            }
        }
        for (let i = 0; i < startandFinish.length; i += 2) {
            const children = [];
            if (startandFinish[i] === startandFinish[i + 1]) {
                children.push(
                    <Col className="modal-col-flex-end" sm={5}>
                        {days[startandFinish[i]]}
                    </Col>,
                );
            } else {
                const subchild = [
                    <div>
                        {abbrevDays[startandFinish[i]]} -{" "}
                        {abbrevDays[startandFinish[i + 1]]}
                    </div>,
                ];
                children.push(
                    <Col className="modal-col-flex-end" sm={5}>
                        {subchild}
                    </Col>,
                );
            }
            children.push(
                <Col className="modal-col-flex-start">
                    {props.item.hours[days[startandFinish[i]]]
                        ? props.item.hours[days[startandFinish[i]]].map(
                            (time, index) =>
                                formatTime(
                                    props.item.hours[days[startandFinish[i]]],
                                    time,
                                    index,
                                ),
                        )
                        : "CLOSED"}
                </Col>,
            );
            rows.push(<Row style={{flexWrap: "nowrap"}}>{children}</Row>);
        }
        return rows;
    }

    function formatTime(arr, time, index) {
        if (time == null) {
            if (index !== arr.length - 1) {
                return <div className="modal-text">CLOSED - </div>;
            }
            return <div className="modal-text">CLOSED</div>;
        }
        const seconds = time;
        let hours = Math.floor(seconds / 3600);
        let mins: string = ((seconds / 60) % 60).toString();
        const endtime_ending = hours < 12 ? "AM" : "PM";
        hours %= 12;
        if (hours === 0) {
            hours = 12;
        }
        if (parseInt(mins) < 10) {
            mins = `0${mins}`;
        }
        const timeformat = `${hours}:${mins}${endtime_ending}`;
        if (index !== arr.length - 1) {
            return <div className="modal-text">{timeformat} - </div>;
        }
        return <div className="modal-text">{timeformat}</div>;
    }

    return (
        <>
            <div className="description-box">
                {props.item.description !== undefined && (
                    <p
                        style={{
                            color: "rgba(148, 142, 142, 0.9)",
                            fontFamily: "Inter",
                            fontWeight: "500",
                            fontSize: "16px",
                            lineHeight: "19px"
                        }}
                    >
                        {props.item.description}
                    </p>
                )}
            </div>
            <div style={infoStyle}>
                <IoPhonePortraitOutline size={20} style={iconStyle} />
                <div>
                    {" "}
                    {props.item.phoneNum &&
                        props.item.phoneNum.join(", ")}
                </div>
            </div>
            <div style={infoStyle}>
                {props.item.website && props.item.website[0] && (
                    <>
                        {props.item.website[0].startsWith("http") ? (<>
                            <SlGlobe size={20} style={iconStyle} />
                            <div>
                                <a
                                    href={props.item.website[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    p{props.item.website[0]}
                                </a>
                            </div>
                        </>) : (<>
                            <SlGlobe size={20} style={iconStyle} />
                            <div>
                                <a
                                    href={'//' + props.item.website[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {props.item.website[0]}
                                </a>
                            </div></>)}

                    </>
                )}
            </div>
            <div style={infoStyle}>
                <TbPlaystationCircle size={20} style={iconStyle} />
                <div>
                    {" "}
                    {props.item.address
                        .toString()
                        .split(",")
                        .map((value, index) => {
                            if (index === 0) {
                                return (
                                    <div style={{ display: "inline" }}>
                                        {value},
                                    </div>
                                );
                            }
                            if (
                                index ===
                                props.item.address.toString().split(",")
                                    .length -
                                1
                            ) {
                                return (
                                    <div style={{ display: "inline" }}>
                                        {value}
                                    </div>
                                );
                            }
                            if (index === 1) {
                                return (
                                    <div
                                        style={{ display: "inline" }}
                                    >{`${value},`}</div>
                                );
                            }
                            return `${value},`;
                        })}
                </div>
            </div>
            <div style={infoStyle}>
                <FaRegClock size={20} style={iconStyle} />
                <div className="modal-hours-container">
                    {props.item.hours && calculateHours(props)}
                </div>
            </div>
        </>
    );
}
