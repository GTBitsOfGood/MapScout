import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Collapse } from "react-collapse";
import { FiMoreVertical } from "react-icons/fi";
import {
    IoIosArrowDown,
    IoIosArrowUp,
    IoIosRefresh,
    IoIosTrash,
    IoMdClose,
} from "react-icons/io";

export default ({
    item,
    index,
    deleteCat,
    disableCat,
    enableCat,
    addOption,
    removeOption,
    changeType,
    rename,
    isDragged,
}) => {
    const [optionName, setOptionName] = useState("");
    const [title, setTitle] = useState(item.name);
    const [collapsed, setCollapsed] = useState(false);

    const myRef = useRef(null);

    return (
        <div className="category-cell-wrapper">
            {console.log(item)}
            <div className="category-button-column">
                {item.active ? (
                    <div className="category-grip">
                        <FiMoreVertical style={{ marginRight: -20 }} />
                        <FiMoreVertical />
                    </div>
                ) : (
                    <Button
                        variant="light"
                        style={{
                            fontSize: 22,
                            borderRadius: 0,
                            padding: 0,
                        }}
                        onClick={() => enableCat(index)}
                    >
                        <IoIosRefresh />
                    </Button>
                )}
                {/* {isDragged || (
                    <Button
                        variant="light"
                        style={{
                            fontSize: 30,
                            height: 38,
                            borderRadius: 0,
                            marginTop: 12,
                            padding: 0,
                        }}
                        onClick={
                            item.active
                                ? () => disableCat(index)
                                : () => deleteCat(index)
                        }
                    >
                        <IoIosTrash style={{ marginTop: -16 }} />
                    </Button>
                )} */}
            </div>
            <div
                className="category-cell-container"
                style={{
                    opacity: item.active ? 1 : 0.5,
                }}
            >
                <div className="category-cell-head">
                    <Row>
                        <Col>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    placeholder="Category Title"
                                    className={"category-cell-head-title"}
                                    disabled={!item.active}
                                    value={title}
                                    style={{ fontWeight: "bolder" }}
                                    onChange={(e: any) => {
                                        setTitle(e.target.value);
                                        rename(e, index);
                                    }}
                                />
                                <FormControl
                                    ref={myRef}
                                    as="select"
                                    className={"category-cell-head-select"}
                                    disabled={!item.active}
                                    value={item.select_type}
                                    onChange={() =>
                                        changeType(
                                            parseInt(myRef.current.value),
                                            index,
                                        )
                                    }
                                >
                                    <option value={0}>Description</option>
                                    {/* <option value={1}>Single-Select</option> */}
                                    <option value={1}>Multi-Select</option>
                                    <option value={2}>Single-Select</option>
                                </FormControl>
                            </InputGroup>
                        </Col>
                        {item.active && (
                            <Col xs={2} md={2} lg={1}>
                                <div
                                    className={"category-button-button"}
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    {collapsed ? (
                                        <IoIosArrowDown />
                                    ) : (
                                        <IoIosArrowUp />
                                    )}
                                </div>
                            </Col>
                        )}
                    </Row>
                </div>
                {!item.active && (
                    <div className="p-2">
                        This category has been disabled. You may either restore
                        it or permanently delete it.
                    </div>
                )}
                <Collapse isOpened={!collapsed && item.active}>
                    {item.select_type === 1 || item.select_type === 2 ? (
                        <div>
                            <div className="form-control options-wrapper">
                                <small className="underline">
                                    CURRENT OPTIONS
                                </small>
                                {item.options && item.options.length > 0 ? (
                                    item.options.map((option, i) => (
                                        <div
                                            key={i}
                                            className="options-item row-spaced mt-1"
                                        >
                                            <div
                                                onClick={() =>
                                                    removeOption(i, index)
                                                }
                                                className="options-close"
                                            >
                                                <IoMdClose />
                                            </div>
                                            <div className="options-label">
                                                {option.label}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        There are currently no options, please
                                        add some
                                    </div>
                                )}
                            </div>
                            <div className="add-option">
                                <div className="row-spaced">
                                    <InputGroup>
                                        <FormControl
                                            value={optionName}
                                            onChange={(e) =>
                                                setOptionName((e.target as HTMLInputElement).value)
                                            }
                                            type="text"
                                            placeholder="Create New Option"
                                        />
                                        <InputGroup.Append>
                                            <Button
                                                onClick={() => {
                                                    addOption(
                                                        optionName,
                                                        index,
                                                    );
                                                    setOptionName("");
                                                }}
                                                disabled={
                                                    !optionName ||
                                                    optionName.length <= 0
                                                }
                                                variant="primary"
                                                className={"category-button-add"}
                                            >
                                                Add
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2">
                            There is no additional configuration for this
                            property type
                        </div>
                    )}
                </Collapse>
            </div>
        </div>
    );
};
