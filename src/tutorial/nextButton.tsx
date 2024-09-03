import React from "react";
import Button from "react-bootstrap/Button";
import { ProviderProps, PopoverContentProps } from "@reactour/tour";

export default (props: {
    setCurrentStep: ProviderProps["setCurrentStep"];
    currentStep: ProviderProps["currentStep"];
    steps?: ProviderProps["steps"];
    setIsOpen: PopoverContentProps["setIsOpen"];
}) => (
    <Button
        onClick={() => {
            if (props.currentStep == props.steps.length - 1) {
                props.setIsOpen(false);
                props.setCurrentStep(0);
            } else {
                props.setCurrentStep(props.currentStep + 1);
            }
        }}
        style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            color: "white",
            backgroundColor: "#244D75",
        }}
    >
        {props.currentStep == 0 ? "Got it!" : "Next"}
    </Button>
);
