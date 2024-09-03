import React, { useState } from "react";
import ReactJoyride, { Step } from "react-joyride";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

const options = {
    arrowColor: "#fff",
    backgroundColor: "#fff",
    beaconSize: 36,
    overlayColor: "rgba(0, 0, 0, 0.5)",
    primaryColor: "#f04",
    spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
    textColor: "#333",
    width: undefined,
    zIndex: 10000000,
};

export class TempTutorialTwo extends React.Component {
    state = {
        steps: [
            {
                target: ".form-control",
                content:
                    "Specify how your filter type applies to a listing. Is your filter type a description such as a short blurb listing every location's management team? Or is it an exclusive, single-select category like 'large,' 'medium,' or 'small'? Or is it a multi-select category like the list of insurances accepted by a medical facility?",
            },
            {
                target: ".form-control.options-wrapper",
                content:
                    "For single and multi-select filter types, specify all the possibilities available: such as every relevant insurance provider or every restaurant category.",
            },
            {
                target: ".category-grip",
                content:
                    "You can reorder your filter types. This change will reflect on your map.",
            },
            {
                target: ".btn-light",
                content:
                    "You can also disable filter types. Clicking the trash icon twice will permanently delete the filter type.",
            },
            {
                target: ".btn-primary",
                content:
                    "When you are done with your changes, click the preview button. Once you are satisfied with the preview, there will be an option to save your changes.",
            },
        ],
    };

    handleJoyrideCallback = (data) => {
        const { action, index, status, type } = data;

        if ([STATUS.FINISHED].includes(status)) {
            document.cookie += "tut2=true;";
        }
    };

    render() {
        const { steps } = this.state;

        return (
            <div className="joyride">
                <ReactJoyride
                    callback={this.handleJoyrideCallback}
                    continuous
                    steps={steps}
                    styles={{ options }}
                />
            </div>
        );
    }
}
