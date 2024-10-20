import "@fontsource/inter";

import React, { useEffect, useRef, useState } from "react";
// import grabberIcon from "../../assets/svg/grabber.svg";
import { ReactComponent as InfoIcon } from "../../assets/svg/info.svg";
import { ReactComponent as ChevronIcon } from "../../assets/svg/chevron.svg";
import { Button, Collapse, Form } from "react-bootstrap";
import ImageModal from "./ImageModal";

import styles from "./Directory.module.css";

interface DirectoryItem {
    name: string;
    description: string;
    details: string;
    image: string;
}

const DirectoryItem = ({ index, item, directoryItems, setDirectoryItems }) => {
    return (
        <div
            className="directoryItem"
            style={{ display: "flex", flexDirection: "column" }}
        >
            <div
                style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "16px",
                }}
            >{`Item ${index + 1}`}</div>
            <Form.Group>
                <Form.Label>
                    Name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control required type="text" placeholder="ex. Hannah" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="ex. Designer" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Details</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ex. Contact, Phone, Email, More info"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Upload Image</Form.Label>
                <div style={{ width: "70%", height: "200px" }}>
                    <ImageModal dropzoneHeight="200px"></ImageModal>
                </div>
            </Form.Group>
            <button
                className="deleteButton"
                type="button"
                style={{
                    alignSelf: "end",
                    border: "none",
                    background: "none",
                    width: "50px",
                    height: "24px",
                    fontSize: "16px",
                    color: "#4F4F4F",
                    fontWeight: "500",
                }}
                onClick={() => {
                    setDirectoryItems((directoryItems) =>
                        directoryItems.filter((_, i) => i !== index)
                    );
                }}
            >
                Delete
            </button>
        </div>
    );
};

const Directory = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const defaultDirectoryItem: DirectoryItem = {
        name: "",
        description: "",
        details: "",
        image: "",
    };
    const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>([
        defaultDirectoryItem,
    ]);
    /*
    directoryItem
    {
      name*:
      description:
      details: 
      image: 
    }
    */
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ display: "flex", height: "32px" }}>
                <button
                    type="button"
                    style={{
                        border: "none",
                        background: "none",
                        margin: "none",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                            style={{
                                color: "#226DFF",
                                fontSize: "20px",
                                marginRight: "8px",
                                fontWeight: "600",
                            }}
                        >
                            Directory
                        </div>
                        <InfoIcon fill="#226DFF"></InfoIcon>
                    </div>
                    <ChevronIcon
                        fill="#226DFF"
                        style={{
                            transform: `rotate(${isOpen ? "0deg" : "180deg"})`,
                            height: "32px",
                            width: "32px",
                        }}
                    ></ChevronIcon>
                </button>
            </div>
            <Collapse in={isOpen}>
                <div
                    className={`directory ${styles.directory}`}
                    style={{ marginTop: "16px", overflowY: "scroll" }}
                >
                    {/* {directoryItems.length} */}
                    {directoryItems.map((directoryItem, index) => (
                        // console.log()
                        <DirectoryItem
                            key={index}
                            index={index}
                            item={directoryItem}
                            directoryItems={directoryItems}
                            setDirectoryItems={setDirectoryItems}
                        ></DirectoryItem>
                    ))}
                    <button
                        className={`addButton ${styles.addButton}`}
                        type="button"
                        onClick={() => {
                            setDirectoryItems([
                                ...directoryItems,
                                defaultDirectoryItem,
                            ]);
                        }}
                    >
                        + Add Item
                    </button>
                </div>
            </Collapse>
        </div>
    );
};

export default Directory;
