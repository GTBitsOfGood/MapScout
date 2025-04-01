import React from "react";
import Button from "react-bootstrap/Button";
import { ProviderProps, PopoverContentProps } from "@reactour/tour";

export default (props: {
    setCurrentStep: ProviderProps["setCurrentStep"];
    currentStep: ProviderProps["currentStep"];
    steps?: ProviderProps["steps"];
    setIsOpen: PopoverContentProps["setIsOpen"];
}) =>
    props.currentStep === 0 ? (
        <></>
    ) : (
        <Button
            onClick={() => {
                props.setCurrentStep(props.currentStep - 1);
            }}
            style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                color: "white",
                backgroundColor: "#007bff",
            }}
        >
            Back
        </Button>
    );
