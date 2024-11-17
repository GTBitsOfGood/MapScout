import React, { useState } from "react";
import * as Icons from "../Icons";
import { SketchPicker, ColorResult } from "react-color";
import { Editor } from "@tiptap/react";

interface ColorPickerButtonProps {
  editor: Editor;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("#000000");

  const handleColorChange = (selectedColor: ColorResult) => {
    setColor(selectedColor.hex);
    editor.chain().focus().setColor(selectedColor.hex).run();
  };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: color,
          width: "24px",
          height: "24px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></button>
      <span style={{ marginLeft: "6px", display: "flex", alignItems: "center" }}>
        <Icons.DropdownArrow />
      </span>
      {isOpen && (
        <div style={{ position: "absolute", zIndex: 1000, top: "100%", left: 0 }}>
          <SketchPicker color={color} onChangeComplete={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;
