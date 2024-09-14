import React, { useState, useEffect } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { withFirestore, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import CategoryCell from "./CategoryCell";
import ProviderInfo from "../subcomponents/ProviderInfo";
import promiseWithTimeout from "../../functions/promiseWithTimeout";
import { Store } from "reducers/types";
import { TempTutorial } from "./TempTutorial";
import { TempTutorialTwo } from "./TempTutorialTwo";

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

const mapStateToProps = (state: Store) => ({
    team: state.item.team,
});

export default compose<any>(
    withFirestore,
    connect(mapStateToProps, {}),
)(({ team, firestore }) => {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState(null);
    const [newCatName, setNewCatName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [, setDefaultCategories] = useState([]);
    const staticData = {
        id: "Preview",
        address: ["123 Fake St, Philadelphia, PA 19133"],
        buildingNum: [],
        description:
            "This is an example provider showcasing all enabled categories",
        facilityName: "Preview",
        hours: {
            Friday: [28800, 75600],
            Monday: [28800, 75600],
            Saturday: [32400, 61200],
            Sunday: null,
            Thursday: [28800, 75600],
            Tuesday: [28800, 75600],
            Wednesday: [28800, 75600],
        },
        image: "modalimage.png",
        imageURL:
            "https://firebasestorage.googleapis.com/v0/b/gtbog-pacts.appspot.com/o/images%2Fmodalimage.png?alt=media&token=89e30d02-02ff-40c5-bcc5-177eebd9ccc8",
        latitude: 39.990206,
        longitude: -75.136872,
        phoneNum: ["(123) 456-7890"],
        team: team.name,
        website: ["https://www.mapscout.io"],
    };

    const [dummy, setDummy] = useState(staticData);

    useEffect(() => {
        async function fetchData() {
            const saved = localStorage.getItem("saved");
            const arr = [];
            const collections = firestore.collection("categories");
            // Note: this is a temperary workaround so the page does appears fine, however, further fix is neccessary to actually resolve the issue
            if (team.name === "") {
                await collections
                    .where("team", "==", saved)
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
            } else {
                localStorage.setItem("saved", team.name);
                await collections
                    .where("team", "==", team.name)
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
            }
            arr.sort((a, b) => a.priority - b.priority);
            setCategories(arr);
            setDefaultCategories(arr);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const newDummy = { ...staticData };
        if (message != null) {
            setMessage(null);
        }
        categories.forEach((category) => {
            if (category.select_type === 0) {
                newDummy[category.id || category.name] =
                    "This is an example description.";
            } else {
                newDummy[category.id || category.name] = category.options.map(
                    ({ value }) => value,
                );
            }
        });
        setDummy(newDummy);
    }, [categories]);

    // async function fetchData() {
    //   const collections = firestore.collection('categories');
    //   const arr = [];
    //   await collections
    //     .where('team', '==', team.name)
    //     .get()
    //     .then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         if (!data.id) {
    //           data.id = doc.id;
    //         }
    //         arr.push(data);
    //       });
    //     });
    //   arr.sort((a, b) => a.priority - b.priority);
    //   setCategories(arr);
    //   setDefaultCategories(arr);
    //   setIsLoading(false);
    // }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        const items = reorder(
            categories,
            result.source.index,
            result.destination.index,
        );
        items.forEach((item: any, index) => {
            item.priority = index;
        });
        setCategories(items);
    }

    async function changeType(type, index) {
        setIsLoading(true);
        const point = await categories[index];
        point.select_type = type;
        setIsLoading(false);

        saveChanges();
    }

    async function rename(e, index) {
        const items = categories;
        const point = items[index];
        point.name = e.target.value;
        setCategories(items);

        saveChanges();
    }

    async function addOption(name, index) {
        setIsLoading(true);
        const point = categories[index];
        if (
            point.options.findIndex(
                (x) => x.label.toLowerCase() === name.toLowerCase(),
            ) === -1
        ) {
            await point.options.push({
                label: name,
                value: name,
            });
        }
        setIsLoading(false);

        saveChanges();
    }

    async function removeOption(i, index) {
        setIsLoading(true);
        const point = categories[index];
        await point.options.splice(i, 1);
        setIsLoading(false);

        saveChanges();
    }

    function disableCat(index) {
        const items: any[] = reorder(categories, index, categories.length - 1);
        items[categories.length - 1].active = false;
        items.forEach((item: any, i) => {
            item.priority = i;
        });
        setCategories(items);

        saveChanges();
    }

    async function enableCat(index) {
        setIsLoading(true);
        const point = await categories[index];
        point.active = true;
        setIsLoading(false);

        saveChanges();
    }

    async function deleteCat(index) {
        setIsLoading(true);
        await categories.splice(index, 1);
        setIsLoading(false);

        saveChanges();
    }

    async function createNewCat() {
        setIsLoading(true);

        await categories.unshift({
            name: newCatName,
            select_type: 2,
            options: [],
            active: true,
            team: team.name,
            id: newCatName,
        });
        
        setNewCatName("");
        setIsLoading(false);

        saveChanges();
    }

    // function resetCategories() {
    //   setCategories(defaultCategories);
    // }

    async function saveChanges() {
        setIsLoading(true);
        try {
            const collections = firestore.collection("categories");
            await collections
                .where("team", "==", team.name)
                .get()
                .then(async (querySnapshot) => {
                    promiseWithTimeout(
                        10000,
                        categories.forEach((cat) => {
                            firestore.set(
                                { collection: "categories", doc: cat.id },
                                cat,
                            );
                        }),
                    ).then(
                        (complete) => {
                            // code that executes after the timeout has completed.
                            promiseWithTimeout(
                                10000,
                                querySnapshot.forEach((doc) => {
                                    if (
                                        categories.findIndex(
                                            (x) => x.id === doc.id,
                                        ) === -1
                                    )
                                        doc.ref.delete();
                                }),
                            ).then(
                                (complete) => {
                                    setMessage(
                                        "Your changes have been saved. You may need to refresh this page to see them.",
                                    );
                                    setShowModal(false);
                                    setIsLoading(false);
                                },
                                () => {
                                    alert(
                                        "Unable to delete removed categories",
                                    );
                                },
                            );
                        },
                        () => {
                            // code that takes care of the canceled promise.
                            // Note that .then rather than .done should be used in this case.
                            alert("Unable to save categories");
                        },
                    );
                });
        } catch {
            alert("Unable to load categories");
        }
    }

    if (isLoading) {
        return (
            <div className="spinner-wrap">
                <div className="spinner" />
            </div>
        );
    }

    console.log(document.cookie);
    return (
        <div id="template-root">
            {(document.cookie == "" || document.cookie == null) && (
                <TempTutorial />
            )}
            {document.cookie.includes("tut=true") &&
                !isEmpty(categories) &&
                !document.cookie.includes("tut2") && <TempTutorialTwo />}
            <Container className="box">
                <div className="row-spaced">
                    <h2>Template Builder</h2>
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
                <br />
                {message != null && <p style={{ color: "green" }}>{message}</p>}
                <InputGroup>
                    <FormControl
                        value={newCatName}
                        onChange={(e) => setNewCatName((e.target as HTMLInputElement).value)}
                        type="text"
                        placeholder="Create New Category"
                    />
                    <InputGroup.Append>
                        <div className="create-cat-wrapper">
                            <Button
                                onClick={() => {
                                    createNewCat();
                                }}
                                variant="primary"
                                disabled={
                                    newCatName == "" ||
                                    newCatName == null ||
                                    categories.findIndex(
                                        (x) => x.name == newCatName,
                                    ) > -1
                                }
                            >
                                Add
                            </Button>
                        </div>
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
                    <Modal.Header style={{ backgroundColor: "#2F80ED" }}>
                        <div className="ml-auto">
                            <Button
                                variant="outline-light"
                                onClick={() => setShowModal(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button onClick={saveChanges} variant="light">
                                Save Changes
                            </Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <ProviderInfo item={dummy} categories={categories} />
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
});
