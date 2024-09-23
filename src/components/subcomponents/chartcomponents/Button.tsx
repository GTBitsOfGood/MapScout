import React from "react";

const Button = ({ link, label }) => {
    return (
        <a href={link} target="_blank">
            <button
                style={{
                    width: "100%",
                    color: "white",
                    borderRadius: "4px",
                    borderColor: "transparent",
                    backgroundColor: "#226DFF",
                    padding: "12px 16px",
                    fontSize: "1rem",
                }}
            >
                {label}
            </button>
        </a>
    );
};

export { Button };
