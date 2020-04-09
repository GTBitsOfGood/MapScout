import React, { useState, useRef } from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FiMoreVertical } from "react-icons/fi";
import { IoMdClose, IoIosArrowDown, IoIosArrowUp, IoIosTrash } from "react-icons/io";
import {Collapse} from 'react-collapse';

export default ({ item, deleteCat, addOption, removeOption, changeType, rename, isDragged }) => {

    const [optionName, setOptionName] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const myRef = useRef(null);

    return (
        <div className="category-cell-wrapper row">
            <div className="category-button-column">
                <div className="category-grip">
                    <FiMoreVertical style={{ marginRight: -20 }}/>
                    <FiMoreVertical/>
                </div>
                {
                    isDragged || <Button
                        variant="light"
                        style={{ fontSize: 30, height: 38, padding: 0 }}
                        onClick={() => deleteCat(item)}>
                        <IoIosTrash style={{ marginTop: -16 }}/>
                    </Button>
                }
            </div>
            <div className="category-cell-container">
                <div className="category-cell-head">
                    <Row>
                        <Col>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    placeholder="Category Title"
                                    value={item.name}
                                    onChange={(e) => rename(e, item)}
                                />
                                <FormControl
                                    ref={myRef}
                                    as="select"
                                    value={item.select_type}
                                    onChange={() => changeType(myRef.current.value, item)}>
                                    <option value={0}>Description</option>
                                    <option value={1}>Single-Select</option>
                                    <option value={2}>Multi-Select</option>
                                </FormControl>
                            </InputGroup>
                        </Col>
                        <Col xs={2} md={2} lg={1}>
                            <Button
                                variant="light"
                                onClick={() => setCollapsed(!collapsed)}>
                                {
                                    collapsed ?
                                        <IoIosArrowDown/>
                                        :
                                        <IoIosArrowUp/>
                                }
                            </Button>
                        </Col>
                    </Row>
                </div>
                <Collapse isOpened={!collapsed}>
                {
                    (item.select_type == 1 || item.select_type == 2) ?
                        <div>
                            <div className="form-control options-wrapper">
                                <small className="underline">CURRENT OPTIONS</small>
                                {
                                    (item.options && item.options.length > 0) ?
                                        item.options.map((option, index) =>
                                        <div key={index} className="options-item row-spaced mt-1">
                                            <div
                                                onClick={() => removeOption(index, item)}
                                                className="options-close">
                                                <IoMdClose/>
                                            </div>
                                            <div
                                                className="options-label">
                                                {option.label}
                                            </div>
                                        </div>)
                                        :
                                        <div>There are currently no options, please add some</div>
                                }
                            </div>
                            <div className="add-option">
                                <div className="row-spaced">
                                    <InputGroup>
                                        <FormControl
                                            value={optionName}
                                            onChange={(e) => setOptionName(e.target.value)}
                                            type="text"
                                            placeholder="Add Option"/>
                                        <InputGroup.Append>
                                            <Button
                                                onClick={() => {
                                                    addOption(optionName, item);
                                                    setOptionName("");
                                                }}
                                                disabled={!optionName || optionName.length <= 0}
                                                variant="primary">
                                                Add
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="p-2">There is no additional configuration for this property type</div>
                }
                </Collapse>
            </div>
        </div>
    )
}
