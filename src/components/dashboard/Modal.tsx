import React from "react";
import ReactModal, { Props } from "react-modal";

// Modal setting.
const modalStyles = {
  overlay: {
    zIndex: 10000
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: 480,
    marginRight: "-50%",
    padding: 24,
    transform: "translate(-50%, -50%)",
    border: "2px solid var(--color-gray-4)",
    borderRadius: "4px"
  }
};

ReactModal.setAppElement("#root");

export function Modal(props: Props) {
  const { style, ...rest } = props;

  return (
    <ReactModal style={{ ...modalStyles, ...style }} {...rest}>
      {props.children}
    </ReactModal>
  );
}
