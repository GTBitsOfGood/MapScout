import React, { useState } from "react";
import "./styles/ChartComponentForm.css";

type ChartType = "donut" | "progress" | "line";

interface DonutData {
    label: string;
    number: number;
    percentage?: string;
}

interface LineData {
    x: string;
    y: number;
}

interface ChartData {
    current?: number;
    total?: number;
    units?: string;
    xLabel?: string;
    yLabel?: string;
    showNumber?: boolean;
    buttonLink?: string;
    buttonLabel?: string;
    donutData?: DonutData[];
    lineData?: LineData[];
}

interface ChartForm {
    type: ChartType;
    title: string;
    data: ChartData;
}

const ChartComponentForm = () => {
    const [chartState, setChartState] = useState<ChartForm>({
        type: "donut",
        title: "",
        data: {
            showNumber: true,
        },
    });

    /*
        Handles type property update and persists state data
    */
    const handleTypeChange = (type: "donut" | "progress" | "line") => {
        setChartState({
            type,
            data: { ...chartState.data },
            title: chartState.title,
        });
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

    /*
        Sets the showNumber flag to its opposite on click of the radio button
    */
    const handleDataViewChange = () => {
        setChartState({
            ...chartState,
            data: {
                ...chartState.data,
                showNumber: !chartState.data.showNumber,
            },
        });
    };

    /*
        Sets the donutData or lineData property in the chartState with the new data whenever a input in either table is changed
    */
    const handleArrayDataChange = (
        index: number,
        key: string,
        value: string | number
    ) => {
        setChartState((prev) => {
            const newData =
                prev.type === "donut"
                    ? [...(prev.data.donutData || [])]
                    : [...(prev.data.lineData || [])];
            newData[index] = { ...newData[index], [key]: value };

            //handles update to percentage column for DonutData
            if (newData.length > 0 && chartState.type === "donut") {
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
                    [prev.type === "donut" ? "donutData" : "lineData"]: newData,
                },
            };
        });
    };

    /*
        Function to add a data "row", another object, to the DonutData[] or LineData[] and sets the object with respective default values
    */
    const addDataRow = () => {
        setChartState((prev) => {
            if (prev.type === "donut") {
                const donutData = [
                    ...(prev.data.donutData || []),
                    { label: "Item X", number: 0, percentage: "0%" },
                ];
                return { ...prev, data: { ...prev.data, donutData } };
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
            case "donut":
                return (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Number</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartState.data.donutData?.map((row, index) => (
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
                    <table className="data-table">
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
            case "donut":
                return (
                    <div className="chart-container">
                        <div
                            className="chart-container"
                            style={{ flexDirection: "row" }}
                        >
                            <div className="field" style={{ width: "60%" }}>
                                <label htmlFor="buttonLabel">
                                    Button Label
                                </label>
                                <input
                                    id="buttonLabel"
                                    type="text"
                                    value={chartState.data.buttonLabel || ""}
                                    onChange={(e) =>
                                        handleDataChange(
                                            "buttonLabel",
                                            e.target.value
                                        )
                                    }
                                    placeholder="ex. Donations"
                                />
                            </div>
                            <div className="field" style={{ width: "75%" }}>
                                <label htmlFor="buttonLink">Button Link</label>
                                <input
                                    id="buttonLink"
                                    type="text"
                                    value={chartState.data.buttonLink || ""}
                                    onChange={(e) =>
                                        handleDataChange(
                                            "buttonLink",
                                            e.target.value
                                        )
                                    }
                                    placeholder="ex. donations.com"
                                />
                            </div>
                        </div>
                        <div className="chart-container" style={{ gap: "8px" }}>
                            <p style={{ margin: "0" }}>
                                Data <span style={{ color: "#EB5757" }}>*</span>
                            </p>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="donutType"
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
                                        name="donutType"
                                        value="percentage"
                                        checked={!chartState.data.showNumber}
                                        onChange={(e) => {
                                            handleDataViewChange();
                                        }}
                                    />
                                    Show Percentage
                                </label>
                            </div>
                            <div className="chart-table-container">
                                {renderDataTable()}
                                <button
                                    onClick={addDataRow}
                                    className="add-button"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case "progress":
                return (
                    <div className="chart-container">
                        <div className="field" style={{ width: "30%" }}>
                            <label htmlFor="current">
                                Current
                                <span style={{ color: "#EB5757" }}> *</span>
                            </label>
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
                        <div className="field" style={{ width: "30%" }}>
                            <label htmlFor="goal">
                                Goal<span style={{ color: "#EB5757" }}> *</span>
                            </label>
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
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="progressType"
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
                                    name="progressType"
                                    value="percentage"
                                    checked={!chartState.data.showNumber}
                                    onChange={(e) => {
                                        handleDataViewChange();
                                    }}
                                />
                                Show Percentage
                            </label>
                        </div>
                        <div className="field" style={{ width: "40%" }}>
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
                        <div
                            className="chart-container"
                            style={{ flexDirection: "row" }}
                        >
                            <div className="field" style={{ width: "60%" }}>
                                <label htmlFor="buttonLabel">
                                    Button Label
                                </label>
                                <input
                                    id="buttonLabel"
                                    type="text"
                                    value={chartState.data.buttonLabel || ""}
                                    onChange={(e) =>
                                        handleDataChange(
                                            "buttonLabel",
                                            e.target.value
                                        )
                                    }
                                    placeholder="ex. Donations"
                                />
                            </div>
                            <div className="field" style={{ width: "75%" }}>
                                <label htmlFor="buttonLink">Button Link</label>
                                <input
                                    id="buttonLink"
                                    type="text"
                                    value={chartState.data.buttonLink || ""}
                                    onChange={(e) =>
                                        handleDataChange(
                                            "buttonLink",
                                            e.target.value
                                        )
                                    }
                                    placeholder="ex. donations.com"
                                />
                            </div>
                        </div>
                    </div>
                );
            case "line":
                return (
                    <div className="chart-container" style={{ width: "100%" }}>
                        <div className="field" style={{ width: "100%" }}>
                            <label htmlFor="xLabel">X-axis label</label>
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
                        <div className="field" style={{ width: "100%" }}>
                            <label htmlFor="yLabel">Y-axis label</label>
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
                        <div
                            className="chart-container"
                            style={{ width: "100%" }}
                        >
                            <p style={{ margin: "0" }}>
                                Data <span style={{ color: "#EB5757" }}>*</span>
                            </p>
                            <div
                                className="chart-table-container"
                                style={{ width: "30%" }}
                            >
                                {renderDataTable()}
                                <button
                                    onClick={addDataRow}
                                    className="add-button"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="chart-container">
            <h1 className="chart-header">Chart</h1>
            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="donut"
                        checked={chartState.type === "donut"}
                        onChange={() => handleTypeChange("donut")}
                    />
                    Donut Chart
                </label>
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="progress"
                        checked={chartState.type === "progress"}
                        onChange={() => handleTypeChange("progress")}
                    />
                    Progress Bar
                </label>
                <label>
                    <input
                        type="radio"
                        name="chartType"
                        value="line"
                        checked={chartState.type === "line"}
                        onChange={() => handleTypeChange("line")}
                    />
                    Line Graph
                </label>
            </div>
            <div className="field">
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
            <div className="footer">
                <button id="delete">Delete</button>
            </div>
            {/*
                TO BE REMOVED
                Used to see chartState state as you fill in form
            */}
            <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify(chartState, null, 2)}</pre>
            </div>
        </div>
    );
};

export default ChartComponentForm;
