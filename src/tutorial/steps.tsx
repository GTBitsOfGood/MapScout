import React from "react";
import Row from "react-bootstrap/Row";
import { StepType } from "@reactour/tour";

const bgColor = "#007bff";

const steps: StepType[] = [
    {
        selector: "#filter-row",
        content: () => (
            <div>
                <Row
                    style={{
                        backgroundColor: bgColor,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 15,
                        color: "white",
                        fontWeight: 500,
                        fontSize: 24,
                        justifyContent: "left",
                    }}
                >
                    Filters
                </Row>
                <Row
                    style={{
                        height: 0,
                        width: 0,
                        position: "absolute",
                        left: 0,
                        borderBottom: "20px solid transparent",
                        borderTop: "20px solid transparent",
                        borderRight: "20px solid white",
                    }}
                ></Row>
                <Row
                    style={{
                        paddingLeft: 1,
                        paddingRight: 1,
                        paddingTop: 5,
                        paddingBottom: 10,
                        borderBottom: "1px solid lightgray",
                        marginRight: 1,
                        marginLeft: 1,
                        marginBottom: 50,
                        fontWeight: 500,
                    }}
                >
                    Refine your search with filters! When selected, only
                    applicable locations will be shown.
                </Row>
            </div>
        ),
        position: [880, 30],
        padding: { mask: [-5, 10] },
    },
    {
        selector: "#provider-space",
        content: () => (
            <div>
                <Row
                    style={{
                        backgroundColor: bgColor,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 15,
                        color: "white",
                        fontWeight: 500,
                        fontSize: 24,
                        justifyContent: "left",
                    }}
                >
                    Search Results
                </Row>
                <Row
                    style={{
                        height: 0,
                        width: 0,
                        position: "absolute",
                        left: 0,
                        borderBottom: "20px solid transparent",
                        borderTop: "20px solid transparent",
                        borderRight: "20px solid white",
                    }}
                ></Row>
                <Row
                    style={{
                        paddingLeft: 1,
                        paddingRight: 1,
                        paddingTop: 5,
                        paddingBottom: 10,
                        borderBottom: "1px solid lightgray",
                        marginRight: 1,
                        marginLeft: 1,
                        marginBottom: 50,
                        fontWeight: 500,
                    }}
                >
                    The locations that match your preference(s) will appear
                    here. Clicking on a result will display the information for
                    that location.
                </Row>
            </div>
        ),
        position: [900, 180],
        padding: { mask: [-5, 2] },
    },
    // {
    //     selector: ".filter-tooltip-tutorial",
    //     content: () => (
    //         <div>
    //             <Row
    //                 style={{
    //                     backgroundColor: bgColor,
    //                     borderTopLeftRadius: 16,
    //                     borderTopRightRadius: 16,
    //                     paddingTop: 5,
    //                     paddingBottom: 5,
    //                     paddingLeft: 15,
    //                     color: "white",
    //                     fontWeight: 500,
    //                     fontSize: 24,
    //                     justifyContent: "left",
    //                 }}
    //             >
    //                 Need Help?
    //             </Row>
    //             <Row
    //                 style={{
    //                     height: 0,
    //                     width: 0,
    //                     position: "absolute",
    //                     left: 0,
    //                     borderBottom: "20px solid transparent",
    //                     borderTop: "20px solid transparent",
    //                     borderRight: "20px solid white",
    //                 }}
    //             ></Row>
    //             <Row
    //                 style={{
    //                     paddingLeft: 1,
    //                     paddingRight: 1,
    //                     paddingTop: 5,
    //                     paddingBottom: 10,
    //                     borderBottom: "1px solid lightgray",
    //                     marginRight: 1,
    //                     marginLeft: 1,
    //                     marginBottom: 50,
    //                     fontWeight: 500,
    //                 }}
    //             >
    //                 If you need a small refresher on certain features, hover
    //                 over this icon for help!
    //             </Row>
    //         </div>
    //     ),
    //     position: [550, 20],
    // },
    {
        selector: ".filter-tooltip-tutorial",
        action: () => console.log("hi"),
        actionAfter: () => console.log("leave"),
        content: () => (
            <div>
                <Row
                    style={{
                        backgroundColor: bgColor,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 15,
                        color: "white",
                        fontWeight: 500,
                        fontSize: 24,
                        justifyContent: "left",
                    }}
                >
                    Location Pins
                </Row>
                <Row
                    style={{
                        height: 0,
                        width: 0,
                        position: "absolute",
                        left: 0,
                        borderBottom: "20px solid transparent",
                        borderTop: "20px solid transparent",
                        borderRight: "20px solid white",
                    }}
                ></Row>
                <Row
                    style={{
                        paddingLeft: 1,
                        paddingRight: 1,
                        paddingTop: 5,
                        paddingBottom: 10,
                        borderBottom: "1px solid lightgray",
                        marginRight: 1,
                        marginLeft: 1,
                        marginBottom: 50,
                        fontWeight: 500,
                    }}
                >
                    Pins show a location's placement on the map. Hover over any
                    Pin to display its Label, as shown. By clicking Show More
                    Info on the Label, you will arrive at the information page
                    for that location, just as you can from the Search Results
                    Panel.
                </Row>
            </div>
        ),
        position: [550, 20],
    },
    {
        selector: ".button-tutorial",
        content: () => (
            <div>
                <Row
                    style={{
                        height: 0,
                        width: 0,
                        position: "absolute",
                        top: -15,
                        right: 50,
                        borderRight: "20px solid transparent",
                        borderLeft: "20px solid transparent",
                        borderBottom: "20px solid #007bff",
                    }}
                ></Row>
                <Row
                    style={{
                        backgroundColor: bgColor,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 15,
                        color: "white",
                        fontWeight: 500,
                        fontSize: 24,
                        justifyContent: "left",
                    }}
                >
                    Restart?
                </Row>
                <Row
                    style={{
                        paddingLeft: 1,
                        paddingRight: 1,
                        paddingTop: 5,
                        paddingBottom: 10,
                        borderBottom: "1px solid lightgray",
                        marginRight: 1,
                        marginLeft: 1,
                        marginBottom: 50,
                        fontWeight: 500,
                    }}
                >
                    Click here if you need to see this tutorial again!
                </Row>
            </div>
        ),
    },
];

export default steps;
