import React, { useState } from "react";
import * as Icons from "./Icons";

interface CustomDropdownProps {
  onChange: (value: string) => void;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  defaultValue: string;
  labelType?: "icon" | "text";
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ onChange, options, defaultValue, labelType = "text" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === defaultValue) || options[0]
  );

  const handleOptionClick = (option: { label: string; value: string }) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "4px 8px",
          color: "black",
          fontSize: "14px",
        }}
      >
        {labelType === "icon" && selectedOption.icon ? (
          <>
            {selectedOption.icon}
            <span style={{ marginLeft: "6px", display: "flex", alignItems: "center" }}>
              <Icons.DropdownArrow />
            </span>
          </>
        ) : (
          <>
            <span>{selectedOption.label}</span>
            <span style={{ marginLeft: "6px", display: "flex", alignItems: "center" }}>
              <Icons.DropdownArrow />
            </span>
          </>
        )}
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "4px",
            padding: "4px",
            backgroundColor: "var(--color-white)",
            border: "1px solid var(--color-gray-4)",
            borderRadius: "4px",
            zIndex: 1,
            display: "flex",
            flexDirection: labelType === "icon" ? "row" : "column",
            gap: "4px",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              style={{
                cursor: "pointer",
                color: "black",
                display: "flex",
                alignItems: "center",
                padding: "8px",
                background: "none",
                border: "none",
              }}
            >
              {option.icon ? option.icon : option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
