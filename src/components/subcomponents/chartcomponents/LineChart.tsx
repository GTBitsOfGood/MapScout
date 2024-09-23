import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/*
   Props:
       title : string,
       data : [{x : string, y : number}]
           EX:
               const data = [
                   { x: "Jan", y: 2500 },
                   { x: "Feb", y: 4500 },
                   { x: "Mar", y: 1050 },
                   { x: "Apr", y: 500 },
                   { x: "May", y: 2305 },
                   { x: "Jun", y: 3846 },
                   { x: "Jul", y: 4628 },
                   { x: "Aug", y: 678 },
                   { x: "Sep", y: 1835 },
                   { x: "Oct", y: 5084 },
                   { x: "Nov", y: 5943 },
                   { x: "Dec", y: 2085 },
               ];
*/
const LineChart = ({ title, data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", "0 0 450 150")
            .attr("x", 10);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 100;
        const margin = { top: 20, right: 0, bottom: 0, left: 0 };

        const xScale = d3
            .scalePoint()
            .domain(data.map((d) => d.x))
            .range([0, width]);
        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min(data.map((d) => d.y)),
                d3.max(data.map((d) => d.y)),
            ] as any)
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Primary group for SVG
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left + 30},${margin.top})`);

        // Adds and controls background dotted lines from y-axis
        g.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0, 8)")
            .call(
                d3
                    .axisLeft(yScale)
                    .ticks(3)
                    .tickSize(-width)
                    .tickFormat(() => "")
            )
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g
                    .selectAll(".tick line")
                    .attr("stroke", "#e0e0e0")
                    .attr("stroke-width", "1")
                    .attr("stroke-dasharray", "1")
            );

        // Adds and controls x-axis
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .call((g) => g.select(".domain").remove())
            .call((g) => g.selectAll(".tick line").remove())
            .call((g) =>
                g
                    .selectAll("text")
                    .attr("dx", "-1em")
                    .attr("dy", "1.2em")
                    .attr("transform", "rotate(0)")
                    .style("text-anchor", "start")
            );

        // Adds and controls y-axis
        g.append("g")
            .call(d3.axisLeft(yScale).ticks(3).tickFormat(d3.format(".1s")))
            .call((g) => g.select(".domain").remove())
            .call((g) => g.selectAll(".tick line").remove())
            .call((g) =>
                g
                    .selectAll("text")
                    .attr("x", -10)
                    .style("text-anchor", "end")
                    .attr("dy", "1.2em")
            );

        // Defines data-line behavior
        const line = d3
            .line<{ x: string; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

        // Adds and controls line on graph
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#0066CC")
            .attr("stroke-width", 1)
            .attr("d", line);

        // Adds and controls the points on the graph from respective data
        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => xScale(d.x))
            .attr("cy", (d: any) => yScale(d.y))
            .attr("r", 3.5)
            .attr("fill", "#0066CC");

        // Adds and controls the header
        g.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2 - 3)
            .attr("text-anchor", "middle")
            .attr("font-weight", "500")
            .style("font-size", "0.88rem")
            .text(title);
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <svg ref={svgRef} style={{ width: "100%" }}></svg>
        </div>
    );
};

export default LineChart;
