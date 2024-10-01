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
}) => {
    const [optionName, setOptionName] = useState("");
    const [color, setColor] = useState("#379bf0");
    const [title, setTitle] = useState(item.name);
    const [collapsed, setCollapsed] = useState(false);

    const myRef = useRef(null);

    return (
        <div className="category-cell-wrapper">
            <div className="category-button-column">
                {item.active ? (
                    <div className="primary-grip">
                        <p style={{ marginRight: 10, marginLeft: 10, }}>{index + 1}</p>
                    </div>
                ) : (
                    <Button
                        variant="light"
                        style={{
                            fontSize: 22,
                            borderRadius: 0,
                            padding: 0,
                        }}
                        onClick={() => enableCat(item)}
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
                                        rename(e, item);
                                    }}
                                />
                                <FormControl
                                    ref={myRef}
                                    as="select"
                                    className={"category-cell-head-select"}
                                    disabled
                                    value={item.select_type}
                                    onChange={() =>
                                        changeType(
                                            parseInt(myRef.current.value),
                                            item,
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
                                            <div className="options-item-1">
                                                <FormControl
                                                type="color"
                                                className="options-color"
                                                placeholder="Choose your color"
                                                defaultValue={option.color}
                                                onChange={(e) => setColor((e.target as HTMLInputElement).value)}
                                                />
                                                <div className="options-label">
                                                    {option.value}
                                                </div>
                                            </div>
                                            <div
                                                onClick={() =>
                                                    removeOption(i, item)
                                                }
                                                className="options-close"
                                            >
                                                <IoMdClose />
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
                                        <FormControl
                                        type="color"
                                        className="options-add-color"
                                        placeholder="Choose your color"
                                        defaultValue={color}
                                        onChange={(e) => setColor((e.target as HTMLInputElement).value)}
                                        />
                                        <FormControl
                                            value={optionName}
                                            onChange={(e) =>
                                                setOptionName((e.target as HTMLInputElement).value)
                                            }
                                            type="text"
                                            defaultValue="#563d7c"
                                            placeholder="Create New Option"
                                        />
                                            <Button
                                                onClick={() => {
                                                    addOption(
                                                        optionName,
                                                        color,
                                                        item,
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
                                </div>
                            </div>
                            <div className="category-delete-container">
                                <p className="category-delete-button" onClick={() => deleteCat(item)}>Delete Filter</p>
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
