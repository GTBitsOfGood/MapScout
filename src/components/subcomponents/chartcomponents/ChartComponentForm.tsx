import React, { useState } from "react";

type ChartForm = {
    type: "pie" | "progress" | "line";
    title: string;
    data: {
        current?: number;
        total?: number;
        units?: string;
        xLabel?: string;
        yLabel?: string;
        showNumber?: boolean;
        pieData?: Array<{
            label: string;
            number: number;
            percentage?: string;
        }>;
        lineData?: Array<{
            x: string | number;
            y: number;
        }>;
    };
};

const ChartComponentForm = () => {
    const [chartState, setChartState] = useState<ChartForm>({
        type: "progress",
        title: "",
        data: {
            showNumber: true,
        },
    });

    const handleTypeChange = (type: "pie" | "progress" | "line") => {
        setChartState({ type, data: { showNumber: true }, title: "" });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChartState({ ...chartState, title: e.target.value });
    };

    const handleDataChange = (key: string, value: string | number) => {
        setChartState((prev) => ({
            ...prev,
            data: { ...prev.data, [key]: value },
        }));
    };

    const handleDataViewChange = () => {
        setChartState({
            ...chartState,
            data: {
                ...chartState.data,
                showNumber: !chartState.data.showNumber,
            },
        });
    };

    const handleArrayDataChange = (
        index: number,
        key: string,
        value: string | number
    ) => {
        setChartState((prev) => {
            const newData =
                prev.type === "pie"
                    ? [...(prev.data.pieData || [])]
                    : [...(prev.data.lineData || [])];
            newData[index] = { ...newData[index], [key]: value };

            //handles auto update to percentage column
            if (newData.length > 0 && chartState.type === "pie") {
                let sum = 0;
                newData.forEach((row) => {
                    sum += row.number;
                });
                newData.forEach((row) => {
                    row.percentage =
                        ((row.number / sum) * 100).toFixed(1) + "%";
                });
            }
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [prev.type === "pie" ? "pieData" : "lineData"]: newData,
                },
            };
        });
    };

    const addDataRow = () => {
        setChartState((prev) => {
            if (prev.type === "pie") {
                const pieData = [
                    ...(prev.data.pieData || []),
                    { label: "Item X", number: 0, percentage: "0%" },
                ];
                return { ...prev, data: { ...prev.data, pieData } };
            } else if (prev.type === "line") {
                const lineData = [
                    ...(prev.data.lineData || []),
                    { x: "Item X", y: 0 },
                ];
                return { ...prev, data: { ...prev.data, lineData } };
            }
            return prev;
        });
    };

    const renderDataTable = () => {
        switch (chartState.type) {
            case "pie":
                return (
                    <table>
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Number</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartState.data.pieData?.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.label}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "label",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.number}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "number",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.percentage}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "percentage",
                                                    e.target.value
                                                )
                                            }
                                            disabled
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case "line":
                return (
                    <table>
                        <thead>
                            <tr>
                                <th>X-axis</th>
                                <th>Y-axis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartState.data.lineData?.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.x}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "x",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.y}
                                            onChange={(e) =>
                                                handleArrayDataChange(
                                                    index,
                                                    "y",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    };

    const renderFields = () => {
        switch (chartState.type) {
            case "pie":
                return (
                    <div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="pieType"
                                    value="number"
                                    checked={chartState.data.showNumber}
                                    onChange={(e) => {
                                        handleDataViewChange();
                                    }}
                                />
                                Show Number
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="pieType"
                                    value="percentage"
                                    onChange={(e) => {
                                        handleDataViewChange();
                                    }}
                                />{" "}
                                Show Percentage
                            </label>
                        </div>
                        {renderDataTable()}
                        <button onClick={addDataRow}>Add Row</button>
                    </div>
                );
            case "progress":
                return (
                    <div>
                        <div>
                            <label htmlFor="current">Current</label>
                            <input
                                id="current"
                                type="number"
                                value={chartState.data.current || ""}
                                onChange={(e) =>
                                    handleDataChange(
                                        "current",
                                        parseFloat(e.target.value)
                                    )
                                }
                                placeholder="ex. 10"
                            />
                        </div>
                        <div>
                            <label htmlFor="goal">Goal</label>
                            <input
                                id="goal"
                                type="number"
                                value={chartState.data.total || ""}
                                onChange={(e) =>
                                    handleDataChange(
                                        "total",
                                        parseFloat(e.target.value)
                                    )
                                }
                                placeholder="ex. 1000"
                            />
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="progressType"
                                    value="number"
                                    checked={chartState.data.showNumber}
                                    onChange={(e) => {
                                        handleDataViewChange();
                                    }}
                                />{" "}
                                Show Number
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="progressType"
                                    value="percentage"
                                    onChange={(e) => {
                                        handleDataViewChange();
                                    }}
                                />{" "}
                                Show Percentage
                            </label>
                        </div>
                        <div>
                            <label htmlFor="units">Units</label>
                            <input
                                id="units"
                                type="text"
                                value={chartState.data.units || ""}
                                onChange={(e) =>
                                    handleDataChange("units", e.target.value)
                                }
                                placeholder="ex. dollars"
                            />
                        </div>
                    </div>
                );
            case "line":
                return (
                    <div>
                        <div>
                            <label htmlFor="xLabel">X-axis Label</label>
                            <input
                                id="xLabel"
                                type="text"
                                placeholder="Title"
                                value={chartState.data.xLabel || ""}
                                onChange={(e) =>
                                    handleDataChange("xLabel", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="yLabel">Y-axis Label</label>
                            <input
                                id="yLabel"
                                type="text"
                                placeholder="Title"
                                value={chartState.data.yLabel || ""}
                                onChange={(e) =>
                                    handleDataChange("yLabel", e.target.value)
                                }
                            />
                        </div>
                        {renderDataTable()}
                        <button onClick={addDataRow}>Add Row</button>
                    </div>
                );
        }
    };

    return (
        <div>
            <h1>Chart Configuration</h1>
            <div>
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="pie"
                        checked={chartState.type === "pie"}
                        onChange={() => handleTypeChange("pie")}
                    />{" "}
                    Pie Chart
                </label>
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="progress"
                        checked={chartState.type === "progress"}
                        onChange={() => handleTypeChange("progress")}
                    />{" "}
                    Progress Bar
                </label>
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="line"
                        checked={chartState.type === "line"}
                        onChange={() => handleTypeChange("line")}
                    />{" "}
                    Line Graph
                </label>
            </div>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={chartState.title}
                    onChange={handleTitleChange}
                    placeholder="Title"
                />
            </div>
            {renderFields()}
            <button>Delete</button>

            {/* <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify(chartState, null, 2)}</pre>
            </div> */}
        </div>
    );
};

export default ChartComponentForm;
