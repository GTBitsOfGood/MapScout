import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {withFirestore} from "react-redux-firebase";
import CategoryCell from "./CategoryCell";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default withFirestore((props) => {

    const [categories, setCategories] = useState([]);
    const [newCatName, setNewCatName] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const {firestore} = props;
        const collections = firestore.collection("categories");
        const arr = [];
        await collections
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    arr.push(data);
                });
            });
        arr.sort((a, b) => a.priority - b.priority);
        setCategories(arr);
        setIsLoading(false)
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        const items = reorder(
            categories,
            result.source.index,
            result.destination.index
        );
        items.map((item, index) => {
            item.priority = index;
        });
        setCategories(items);
    }

    async function changeType(type, index) {
        setIsLoading(true);
        let point = await categories[index];
        point.select_type = type;
        setIsLoading(false);
    }

    async function rename(e, index) {
        const items = categories;
        let point = items[index];
        point.name = e.target.value;
        setCategories(items);
    }

    async function addOption(name, index) {
        setIsLoading(true);
        let point = categories[index];
        if (point.options.findIndex(x => x.label.toLowerCase() === name.toLowerCase()) === -1) {
            await point.options.push({
                label: name,
                value: name.replace(/\s/g, '').toLowerCase(),
            });
        }
        setIsLoading(false);
    }

    async function removeOption(i, index) {
        setIsLoading(true);
        let point = categories[index];
        await point.options.splice(i, 1);
        setIsLoading(false);
    }

    function disableCat(index) {
        const items = reorder(
            categories,
            index,
            categories.length - 1);
        items[categories.length - 1].active = false;
        items.map((item, i) => {
            item.priority = i;
        });
        setCategories(items);
    }

    async function enableCat(index) {
        setIsLoading(true);
        let point = await categories[index];
        point.active = true;
        setIsLoading(false);
    }

    async function deleteCat(index) {
        setIsLoading(true);
        await categories.splice(index, 1);
        setIsLoading(false);
    }

    async function createNewCat() {
        setIsLoading(true);
        await categories.unshift({
            name: newCatName,
            select_type: 2,
            options: [],
            active: true,
            team: "pacts"
        });
        setNewCatName("");
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div style={{ width: '100%' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div id="template-root">
            <Container className="box">
                <div className="row-spaced">
                    <h2>Resource Template</h2>
                    <Button
                        variant="primary">
                        Save Changes
                    </Button>
                </div>
                <br />
                <InputGroup>
                    <FormControl
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        type="text"
                        placeholder="Create New Category"/>
                    <InputGroup.Append>
                        <Button
                            onClick={() => {
                                createNewCat();
                            }}
                            variant="primary">
                            Add
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
                <br />
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {
                                    categories.map((item, index) => <Draggable
                                        key={item.name}
                                        draggableId={item.name}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={provided.draggableProps.style}
                                            >
                                                <CategoryCell
                                                    item={item}
                                                    index={index}
                                                    disableCat={disableCat}
                                                    enableCat={enableCat}
                                                    deleteCat={deleteCat}
                                                    changeType={changeType}
                                                    rename={rename}
                                                    addOption={addOption}
                                                    removeOption={removeOption}
                                                    isDragged={snapshot.isDragging}/>
                                            </div>
                                            )
                                        }
                                    </Draggable>)
                                }
                                {provided.placeholder}
                            </div>
                        )
                        }
                    </Droppable>
                </DragDropContext>
            </Container>
        </div>
    )
});
