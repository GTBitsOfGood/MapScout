import "@fontsource/inter";

import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
// import grabberIcon from "../../assets/svg/grabber.svg";
import { ReactComponent as GrabberIcon } from "../../assets/svg/grabber.svg";
import { ReactComponent as PencilIcon } from "../../assets/svg/pencil.svg";
import { ReactComponent as CheckmarkIcon } from "../../assets/svg/checkmark.svg";

import styles from "./ContentForm.module.css";
import Directory from "./Directory";

const EditableText = ({ text, setText, isEditing, setIsEditing }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ minWidth: "250px", marginRight: "8px" }}>
                {isEditing ? (
                    <Form.Control
                        type="text"
                        value={text}
                        placeholder="Section Title"
                        // className={styles.text}
                        ref={inputRef}
                        onChange={handleChange}
                        style={{
                            display: "inline-block",
                            paddingLeft: "5px",
                            maxHeight: "36px",
                            width: "250px",
                            lineHeight: "24px",
                            background: "transparent",
                            border: "none",
                            color: "black",
                            fontSize: "20px",
                            fontWeight: "400",
                            fontFamily: "Inter, sans-serif",
                        }}
                    ></Form.Control>
                ) : (
                    <div className={styles.editableLabel}>
                        <span
                            className={styles.text}
                            style={{
                                lineHeight: "24px",
                                color: `${text === "" ? "#6C757D" : "black"}`,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {text || "Section Title"}
                        </span>
                    </div>
                )}
            </div>

            <button
                type="button"
                style={{
                    border: "none",
                    background: "transparent",
                    padding: "0px",
                    margin: "0px",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                }}
                onClick={() => {
                    setIsEditing(!isEditing);
                }}
            >
                {isEditing ? (
                    <CheckmarkIcon height={20} width={20} />
                ) : (
                    <PencilIcon height={20} width={20} />
                )}
            </button>
        </div>
    );
};

const SectionCard = ({
    index,
    section,
    sections,
    setSections,
    setSelectedSection,
    isEditing,
    setIsEditing,
}) => {
    return (
        <Container fluid className="p-0 h-100 d-flex flex-column">
            <Row
                className=" w-100 d-inline-flex flex-row align-items-center justify-content-between"
                style={{
                    height: "40px",
                    margin: "0px 0px 16px 0px",
                    // whiteSpace: "nowrap",
                    // overflow: "hidden",
                }}
            >
                <EditableText
                    text={section.name}
                    setText={(text) => {
                        setSections([
                            ...sections.slice(0, index),
                            { ...sections[index], name: text },
                            ...sections.slice(index + 1),
                        ]);
                    }}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
                <button
                    className={styles.deleteButton}
                    type="button"
                    style={{
                        color: "#4f4f4f",
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "Inter, sans-serif",
                    }}
                    onClick={() => {
                        setSelectedSection(null);
                        setSections((sections) =>
                            sections.filter((_, i) => i !== index)
                        );
                    }}
                >
                    Delete Section
                </button>
            </Row>
            <Row
                className="flex-fill m-0 w-100"
                style={{ borderRadius: "8px", backgroundColor: "#FFFFFF"}}
            >
                <Directory />
            </Row>
        </Container>
    );
};

const SectionButton = ({
    selectedSection,
    setSelectedSection,
    sectionInfo,
    index,
    setIsEditing,
}) => {
    // const [selected, setSelected] = useState()
    // const fillColor =
    const isSelected = selectedSection === index;
    const fillColor = isSelected ? "#226DFF" : "#828282";

    return (
        <button
            type="button"
            className={styles.sectionButton}
            onClick={() => {
                if (index !== selectedSection) {
                    setIsEditing(false);
                }
                setSelectedSection(index);
            }}
        >
            <Row noGutters className="h-100">
                <Col
                    className="h-100"
                    style={{
                        maxWidth: "12px",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                        backgroundColor: `${
                            isSelected ? "#226DFF" : "transparent"
                        }`,
                    }}
                ></Col>
                <Col
                    style={{
                        maxWidth: "32px",
                        margin: "12px 4px 12px 4px",
                    }}
                >
                    <GrabberIcon fill={fillColor}></GrabberIcon>
                </Col>
                <Col
                    className={`h-100 d-flex align-items-center text-truncate ${styles.text}`}
                    style={{
                        textAlign: "left",
                        lineHeight: "30px",
                        color: fillColor,
                    }}
                >
                    {sectionInfo.name || "Section Title"}
                </Col>
            </Row>
        </button>
    );
};

const ContentForm = ({ content, onChange }) => {
    const [selectedSection, setSelectedSection] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [sections, setSections] = useState(content);
    /*
      [
        {
          name: "Section 1",
          components: [],
        },
        {
          name: "Section 2",
          components: [],
        },
      ]
    */

    const updateSections = (newSections) => {
        setSections(newSections);
        onChange(newSections);
    };

    /*
    section objct
    {
      "name": "Section 1",
      "components": []
    }
    */

    return (
        <Row className="pl-3 pr-3" style={{ height: "700px" }}>
            <Col
                className="col-auto h-100"
                style={{
                    padding: "16px",
                    width: "264px",
                    backgroundColor: "#F1F4FA",
                    overflowY: "auto",
                }}
            >
                <h3
                    className={styles.text}
                    style={{
                        marginBottom: "12px",
                        lineHeight: "30px",
                    }}
                >
                    Sections
                </h3>
                {sections.map((section, index) => (
                    <SectionButton
                        key={index}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        sectionInfo={section}
                        index={index}
                        setIsEditing={setIsEditing}
                    ></SectionButton>
                ))}
                <Button
                    style={{
                        width: "232px",
                        height: "44px",
                        lineHeight: "24px",
                    }}
                    className={styles.text}
                    onClick={() => {
                        updateSections([
                            ...sections,
                            { name: "", components: [] },
                        ]);
                    }}
                >
                    Add Section
                </Button>
            </Col>
            <Col
                className="h-100"
                style={{
                    backgroundColor: "#E3E9F5",
                    padding: "16px 16px 28px 16px",
                }}
            >
                {selectedSection === null ? null : (
                    <SectionCard
                        index={selectedSection}
                        section={sections[selectedSection]}
                        sections={sections}
                        setSections={updateSections}
                        setSelectedSection={setSelectedSection}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    ></SectionCard>
                )}
            </Col>
        </Row>
    );
};

export default ContentForm;
