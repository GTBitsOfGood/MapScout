import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/*
   Props:
       data : [{x : number, y : number}]
           EX:
               const data = [
                   { x: 0, y: 2500 },
                   { x: 1, y: 4500 },
                   { x: 2, y: 1050 },
                   { x: 3, y: 500 },
                   { x: 4, y: 2305 },
                   { x: 5, y: 3846 },
                   { x: 6, y: 4628 },
                   { x: 6, y: 678 },
                   { x: 8, y: 1835 },
                   { x: 9, y: 5084 },
                   { x: 10, y: 5943 },
                   { x: 1, y: 2085 },
               ];
*/
const LineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current).attr("viewBox", "0 0 425 150");
        svg.selectAll("*").remove();

        const sortedData = [...data].sort((a, b) => a.x - b.x);
        const xArr = sortedData.map((d) => d.x);
        const yArr = sortedData.map((d) => d.y);

        const minX = Math.min(...xArr);
        const maxX = Math.max(...xArr);
        const minY = Math.min(...yArr);
        const maxY = Math.max(...yArr);

        const maxLabelLength = Math.max(...yArr).toString().length;

        const margin = {
            top: 20,
            right: 70,
            bottom: 25,
            left: maxLabelLength * 2,
        };
        const width = 450 - margin.left - margin.right;
        const height = 150 - margin.top - margin.bottom;

        const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width]);
        const yScale = d3
            .scaleLinear()
            .domain([minY, maxY])
            .nice()
            .range([height, 0]);

        // Primary group for SVG
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left + 30},${margin.top})`);

        // Adds and controls background dotted lines from y-axis
        g.append("g")
            .attr("class", "grid")
            .call(
                d3
                    .axisLeft(yScale)
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
            .call(d3.axisBottom(xScale).tickValues(xArr))
            .call((g) => g.select(".domain").remove())
            .call((g) => g.selectAll(".tick line").remove())
            .call((g) =>
                g
                    .selectAll("text")
                    .attr("dx", "0.3em")
                    .attr("dy", "1.2em")
                    .style("text-anchor", "end")
            );

        // Adds and controls y-axis
        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2s")))
            .call((g) => g.select(".domain").remove())
            .call((g) => g.selectAll(".tick line").remove());

        // Defines data-line behavior
        const line = d3
            .line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

        // Adds and controls line on graph
        g.append("path")
            .datum(sortedData)
            .attr("fill", "none")
            .attr("stroke", "#0066CC")
            .attr("stroke-width", 1)
            .attr("d", line);

        // Adds and controls the points on the graph from respective data
        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => {
                console.log(xScale(d.x));
                return xScale(d.x);
            })
            .attr("cy", (d: any) => yScale(d.y))
            .attr("r", 3.5)
            .attr("fill", "#0066CC");
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
