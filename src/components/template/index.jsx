import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {withFirestore} from "react-redux-firebase";
import CategoryCell from "./CategoryCell";
import ProviderInfo from "../ProviderInfo";
import promiseWithTimeout from "../../utils/PromiseWithTimeout";
import {compose} from "redux";
import {connect} from "react-redux";
import {selectItem} from "../Dashboard";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const mapStateToProps = (state) => ({
    team: state.item.team,
});

export default compose(
    withFirestore,
    connect(
        mapStateToProps,
        {},
    ),
)((props) => {

    const [categories, setCategories] = useState([]);
    const [newCatName, setNewCatName] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [defaultCategories, setDefaultCategories] = useState([]);
    const staticData = {
        id:"Preview",
        address: ["123 Fake St, Philadelphia, PA 19133"],
        ages: ["Children","Adolescents","Preteens"],
        buildingNum: [],
        childcare: [false],
        facilityName: "Preview",
        hours: {"Friday":[28800,75600],"Monday":[28800,75600],"Saturday":[32400,61200],"Sunday":null,"Thursday":[28800,75600],"Tuesday":[28800,75600],"Wednesday":[28800,75600]},
        image: "modalimage.png",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/gtbog-pacts.appspot.com/o/images%2Fmodalimage.png?alt=media&token=89e30d02-02ff-40c5-bcc5-177eebd9ccc8",
        latitude: 39.990206,
        longitude: -75.136872,
        notes: [],
        phoneNum: ["(123) 456-7890"],
        team: props.team.name,
        website: ["https://www.mapscout.io"]
    };

    const [dummy, setDummy] = useState(staticData);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const newDummy = { ...staticData };
        categories.forEach((category) => {
            newDummy[category.id || category.name] = category.options.map(({ value }) => value);
        });
        setDummy(newDummy);
    }, [JSON.stringify(categories)]);

    async function fetchData() {
        const {firestore} = props;
        const collections = firestore.collection("categories");
        const arr = [];
        await collections
            .where("team", "==", props.team.name)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (!data.id) {
                        data.id = doc.id;
                    }
                    arr.push(data);
                });
            });
        arr.sort((a, b) => a.priority - b.priority);
        setCategories(arr);
        setDefaultCategories(arr);
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
                value: name,
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
            team: props.team.name,
            id: newCatName,
        });
        setNewCatName("");
        setIsLoading(false);
    }

    function resetCategories() {
        setCategories(defaultCategories);
    }

    async function saveChanges() {
        setIsLoading(true);
        try {
            const collections = props.firestore.collection('categories');
            const filters = await collections
                .where("team", "==", props.team.name)
                .get()
                .then(async (querySnapshot) => {
                await querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                }); //Deletes all categories
                await categories.forEach((cat) => {
                    promiseWithTimeout(5000, props.firestore.set({collection: 'categories', doc: cat.id}, cat));
                }); //Replaces with new data
                setIsLoading(false);
                setShowModal(false);
            });
        } catch (e) {
            console.log(e);
            alert("Unable to save");
        }
    }

    if (isLoading) {
        return (
            <div className="spinner-wrap">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div id="template-root">
            <Container className="box">
                <div className="row-spaced">
                    <h2>Template Builder</h2>
                    <div>
                        {/*<Button*/}
                        {/*    variant="outline-primary"*/}
                        {/*    onClick={(e) => {*/}
                        {/*        e.preventDefault();*/}
                        {/*        resetCategories();*/}
                        {/*    }}*/}
                        {/*    className="mr-2"*/}
                        {/*>*/}
                        {/*    Reset Changes*/}
                        {/*</Button>*/}
                        <Button
                            variant="primary"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(true);
                            }}
                        >
                            Preview
                        </Button>
                    </div>
                </div>
                <br />
                <InputGroup>
                    <FormControl
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        type="text"
                        placeholder="Create New Category"
                    />
                    <InputGroup.Append>
                        <Button
                            onClick={() => {
                                createNewCat();
                            }}
                            variant="primary"
                        >
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
                                {categories.map((item, index) => (
                                    <Draggable
                                        key={item.name}
                                        draggableId={item.name}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={
                                                    provided.draggableProps
                                                        .style
                                                }
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
                                                    isDragged={
                                                        snapshot.isDragging
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <Modal show={showModal} dialogClassName="myModal" scrollable>
                    <Modal.Header
                        style={{ backgroundColor: "#2F80ED" }}
                    >
                        <div className="ml-auto">
                            <Button
                                variant="outline-light"
                                onClick={() => setShowModal(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={saveChanges}
                                variant="light">Save Changes</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <ProviderInfo item={dummy} categories={categories}/>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
});
