import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Button } from "./Button";

interface Data {
    label: string;
    number: number;
    percentage: string;
}

const formatNumberWithCommas = (number: number): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/*
    Props:
        data : [{label : string, number : number, percentage : string}],
            EX:
                const data = [
                    { label: "Equipment", number: 7140, percentage: "34%" },
                    { label: "Programs", number: 5670, percentage: "27%" },
                    { label: "Technology", number: 4410, percentage: "21%" },
                    { label: "Uniforms", number: 3780, percentage: "18%" },
                ];
        buttonLink : string,
        buttonLabel : string
*/
const DonutChart = ({ data, buttonLink, buttonLabel }) => {
    const svgRef = useRef(null);
    buttonLink = !/^https?:\/\//i.test(buttonLink)
        ? "http://" + buttonLink
        : buttonLink; //make sures external link has proper formatting

    useEffect(() => {
        const width = parseInt(d3.select(svgRef.current).style("width"));
        const height = width;
        const radius = Math.min(width, height) / 4;

        const svg = d3.select(svgRef.current).attr("viewBox", "0 0 100 65");
        svg.selectAll("*").remove();

        // Sets color for donut chart
        const baseColor = d3.rgb("#7EAAFF");

        // Sets opacity range based on baseColor and set range value
        const opacityScale = d3
            .scaleLinear()
            .domain([0, data.length - 1])
            .range([1, 0.2]);

        // Method to process and sort the data
        const pie = d3
            .pie<Data>()
            .value((d) => d.number)
            .sort((a, b) => d3.descending(a.number, b.number));

        // Defines the outer donut size and donut hole size
        const arc = d3
            .arc()
            .innerRadius(radius * 0.45)
            .outerRadius(radius - 2);

        // Primary SVG group
        const svgGroup = svg
            .attr("width", String(width) + "%")
            .attr("height", String(height - 10) + "%")
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 3})`);

        // Sets the proper color for each slice, the pie method sorts from descending so largest value has full opacity
        svgGroup
            .selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc as any)
            .attr("fill", (_, i): any => {
                const opacity = opacityScale(i);
                return d3.rgb(baseColor.r, baseColor.g, baseColor.b, opacity);
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", "0.25px");

        // Defines the "circle" that the inner percentage labels are aligned to
        const labelArc = d3
            .arc()
            .outerRadius(radius - 15)
            .innerRadius(radius * 0.95);

        // Adds and controls the inner labels, or the percentages inside
        svgGroup
            .selectAll(".inner-label")
            .data(pie(data))
            .enter()
            .append("text")
            .attr("class", "inner-label")
            .attr(
                "transform",
                (d) => `translate(${labelArc.centroid(d as any)})`
            )
            .text((d) => d.data.percentage)
            .attr("dy", "1.5px")
            .style("text-anchor", "middle")
            .attr("font-size", "0.2rem");

        // Defines the "circle" that the outer info labels are aligned to
        const outerArc = d3
            .arc()
            .innerRadius(radius * 1)
            .outerRadius(radius * 1.1);

        // Defines outer info label group and controls their positioning
        const outerLabel = svgGroup
            .selectAll(".outer-label")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "outer-label")
            .attr("transform", function (d) {
                const pos = outerArc.centroid(d as any);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 1.45 * (midAngle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            });

        // Adds and controls the label from inputted data
        outerLabel
            .append("text")
            .text((d) => d.data.label)
            .attr("dy", "-0.5em")
            .attr("text-anchor", "middle")
            .attr("font-size", "0.15rem")
            .attr("fill", "#7C7C7C");

        // Adds and controls the number from inputted data
        outerLabel
            .append("text")
            .text((d) => `($${formatNumberWithCommas(d.data.number)})`)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .attr("font-size", "0.15rem")
            .attr("fill", "#7C7C7C");

        // Defines the lines connecting inner and outer labels
        const leaderArc = d3
            .arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.8);

        // Adds and controls how the lines are generated and positions them between inner and outer label
        svgGroup
            .selectAll(".leader-line")
            .data(pie(data))
            .enter()
            .append("polyline")
            .attr("class", "leader-line")
            .attr("points", function (d: any): any {
                const posA = leaderArc.centroid(d);
                const posB = outerArc.centroid(d);
                const posC = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = radius * 1.1 * (midAngle < Math.PI ? 1 : -1);
                return [posA, posB, posC];
            })
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", "0.1px");
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <svg ref={svgRef} style={{ width: "100%" }}></svg>
            <Button link={buttonLink} label={buttonLabel} />
        </div>
    );
};

export default DonutChart;
