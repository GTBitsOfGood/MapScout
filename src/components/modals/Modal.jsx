import React from "react";
import "./Modal.css";

export default function Modal(props) {
    // eslint-disable-next-line no-console
    console.log(props);
    return (
        <div
            className="modal-content"
            style={{
                height: props.height,
                width: props.width,
                top: props.top,
                left: props.left,
            }}
        >
            {props.children}
        </div>
    );
}
