import React from 'react';
import Row from "react-bootstrap/Row";
import { StepType } from '@reactour/tour';
const steps:StepType[] = [
    {
        selector: ".filters",
        content: () => (
            <div>
                <Row style={{backgroundColor: "#244D75", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 5, paddingBottom: 5, paddingLeft: 15, color: "white", fontWeight: 500, fontSize: 24, justifyContent: "left"}}>Filters</Row>
                <Row style={{height: 0, width: 0, position: "absolute", left: 0, borderBottom: "20px solid transparent", borderTop: "20px solid transparent", borderRight: "20px solid white"}}></Row>
                <Row style={{paddingLeft: 1, paddingRight: 1, paddingTop: 5, paddingBottom: 10, borderBottom: "1px solid lightgray", marginRight: 1, marginLeft: 1, marginBottom: 50, fontWeight: 500}}>Filters can be a powerful way to refine your data and get the specific information you need. Waypoints can be filtered with these dropdowns, which will vary depending on the map that is being viewed.</Row>
            </div>
            
        ),
        position: [880, 30],
    },
    {
        selector: ".result-tutorial",
        content: () => (
            <div>
                <Row style={{backgroundColor: "#244D75", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 5, paddingBottom: 5, paddingLeft: 15, color: "white", fontWeight: 500, fontSize: 24, justifyContent: "left"}}>Search Results</Row>
                <Row style={{height: 0, width: 0, position: "absolute", left: 0, borderBottom: "20px solid transparent", borderTop: "20px solid transparent", borderRight: "20px solid white"}}></Row>
                <Row style={{paddingLeft: 1, paddingRight: 1, paddingTop: 5, paddingBottom: 10, borderBottom: "1px solid lightgray", marginRight: 1, marginLeft: 1, marginBottom: 50, fontWeight: 500}}>Here is a result that is displayed. Hovering over it will show the location on the map and clicking on the result will display addition information.</Row>
            </div>
        ),
        position: [900,180],
        
    },
    {
        selector: ".filter-tooltip-tutorial",
        content: () => (
            <div>
                <Row style={{backgroundColor: "#244D75", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 5, paddingBottom: 5, paddingLeft: 15, color: "white", fontWeight: 500, fontSize: 24, justifyContent: "left"}}>Need Help?</Row>
                <Row style={{height: 0, width: 0, position: "absolute", left: 0, borderBottom: "20px solid transparent", borderTop: "20px solid transparent", borderRight: "20px solid white"}}></Row>
                <Row style={{paddingLeft: 1, paddingRight: 1, paddingTop: 5, paddingBottom: 10, borderBottom: "1px solid lightgray", marginRight: 1, marginLeft: 1, marginBottom: 50, fontWeight: 500}}>If you need a small refresher on certain features, hover over this icon for help!</Row>
            </div>
        ),
        position: [550,20],
        
               
    },
    {
        selector: ".button-tutorial",
        content: () => (
            <div>
                <Row style={{height: 0, width: 0, position: "absolute", top: -15, right: 50, borderRight: "20px solid transparent", borderLeft: "20px solid transparent", borderBottom: "20px solid #244D75"}}></Row>
                <Row style={{backgroundColor: "#244D75", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 5, paddingBottom: 5, paddingLeft: 15, color: "white", fontWeight: 500, fontSize: 24, justifyContent: "left"}}>Restart?</Row>
                <Row style={{paddingLeft: 1, paddingRight: 1, paddingTop: 5, paddingBottom: 10, borderBottom: "1px solid lightgray", marginRight: 1, marginLeft: 1, marginBottom: 50, fontWeight: 500}}>Click here if you need to see this tutorial again!</Row>
            </div>
        ),
        
    },
];

export default steps;
