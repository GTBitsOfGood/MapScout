import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
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

    async function changeType(type, item) {
        setIsLoading(true);
        let point = await categories.find(x => x === item);
        point.select_type = type;
        setIsLoading(false);
    }

    function rename(e, item) {
        let point = categories.find(x => x === item);
        point.name = e.target.value;
    }

    async function addOption(name, item) {
        setIsLoading(true);
        let point = categories.find(x => x === item);
        if (point.options.findIndex(x => x.label.toLowerCase() === name.toLowerCase()) === -1) {
            await point.options.push({
                label: name,
                value: name.replace(/\s/g, '').toLowerCase(),
            });
        }
        setIsLoading(false);
    }

    async function removeOption(index, item) {
        setIsLoading(true);
        let point = categories.find(x => x === item);
        await point.options.splice(index, 1);
        setIsLoading(false);
    }

    async function deleteCat(item) {
        setIsLoading(true);
        let point = categories.findIndex(x => x === item);
        await categories.splice(point, 1);
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
