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
import PrimaryCell from "./PrimaryCell";
import ProviderInfo from "../subcomponents/ProviderInfo";
import promiseWithTimeout from "../../functions/promiseWithTimeout";
import { Store } from "reducers/types";
import { TempTutorial } from "./TempTutorial";
import { TempTutorialTwo } from "./TempTutorialTwo";
import { ToggleSlider }  from "react-toggle-slider";
import { BsPlus } from "react-icons/bs";
import { Card } from "react-bootstrap";
import { uuid } from "uuidv4";
const { v4: uuidv4 } = require("uuid");

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
    const [providers, setProviders] = useState([]);
    const [message, setMessage] = useState(null);
    const [newCatName, setNewCatName] = useState("Please edit name of new category");
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [usePrimary, setUsePrimary] = useState(false);
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
            const arr2 = [];
            const collections = firestore.collection("categories");
            const collections2 = firestore.collection("providers");
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
            if (team.name === "") {
                await collections2
                    .where("team", "==", saved)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            if (!data.id) {
                                data.id = doc.id;
                            }
                            arr2.push(data);
                        });
                    });
            } else {
                localStorage.setItem("saved", team.name);
                await collections2
                    .where("team", "==", team.name)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            if (!data.id) {
                                data.id = doc.id;
                            }
                            arr2.push(data);
                        });
                    });
            }
            setProviders(arr2)
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
        saveChanges();
    }

    async function changeType(type, item) {
        setIsLoading(true);
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        const point = await categories[index];
        point.select_type = type;
        setIsLoading(false);

        saveChanges();
    }

    async function rename(e, item) {
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        const items = categories;
        const point = items[index];
        point.name = e.target.value;
        setCategories(items);

        saveChanges();
    }

    async function changeColor(color, name, item) {
        setIsLoading(true);
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        const point = categories[index];
        index = 0
        for (let i of point.options) {
            if(i.value === name) {
                break;
            }
            index++;
        }
        point.options[index].color = color
        setIsLoading(false);

        saveChanges();
    }


    async function addOption(name, item) {
        setIsLoading(true);
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
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

    async function addPrimOption(name, colors, item) {
        setIsLoading(true);
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        const point = categories[index];
        if (
            point.options.findIndex(
                (x) => x.value.toLowerCase() === name.toLowerCase(),
            ) === -1
        ) {
            await point.options.push({
                color: colors,
                value: name,
            });
        }
        setIsLoading(false);

        saveChanges();
    }

    async function removeOption(i, item) {
        setIsLoading(true);
        let index = 0;
        let index2 = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        const point = categories[index];
        providers.forEach((val) => {
            if (item.id in val) {
                for (let curr of val[item.id as keyof typeof val]) {
                    if (point.options[i].value == curr) {
                        break;
                    }
                    index2++;
                };
            val[item.id as keyof typeof val].splice(index2, 1);
            }
        });
        await point.options.splice(i, 1);
        setIsLoading(false);

        saveChanges();
    }

    function disableCat(item) {
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        const items: any[] = reorder(categories, index, categories.length - 1);
        items[categories.length - 1].active = false;
        items.forEach((item: any, i) => {
            item.priority = i;
        });
        setCategories(items);

        saveChanges();
    }

    async function enableCat(item) {
        setIsLoading(true);
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        const point = await categories[index];
        point.active = true;
        setIsLoading(false);

        saveChanges();
    }

    async function deleteCat(item) {
        setIsLoading(true);
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        providers.forEach((val) => {
            if (item.id in val) {
                delete val[item.id as keyof typeof val];
            }
        });
        await categories.splice(index, 1);
        
        categories.forEach((item: any, index) => {
            item.priority = index;
        });
        setIsLoading(false);

        saveChanges();
    }

    async function deletePrim(item) {
        setIsLoading(true);
        let index = 0;
        for (let i of categories) {
            if(i.name === item.name) {
                break;
            }
            index++;
        }
        await categories.splice(index, 1);
        categories.forEach((item: any, index) => {
            item.priority = index;
        });
        setIsLoading(false);

        saveChanges();
    }

    async function createNewCat() {
        setIsLoading(true);
        let type = 1
        if (usePrimary) {
            type = 2
        }
        await categories.unshift({
            name: newCatName,
            select_type: type,
            options: [],
            active: true,
            team: team.name,
            id: uuidv4(),
            isPrimary: usePrimary,
            priority: categories.length
        });
        setNewCatName("Please edit name of new category");
        console.log(categories)
        setIsLoading(false);

        saveChanges();
    }

    // function resetCategories() {
    //   setCategories(defaultCategories);
    // }

    async function saveChanges() {
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

        try {
            const collections = firestore.collection("providers");
            await collections
                .where("team", "==", team.name)
                .get()
                .then(async (querySnapshot) => {
                    promiseWithTimeout(
                        10000,
                        providers.forEach((cat) => {
                            firestore.set(
                                { collection: "providers", doc: cat.id },
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
                                        providers.findIndex(
                                            (x) => x.id === doc.id,
                                        ) === -1
                                    )
                                        doc.ref.delete();
                                }),
                            ).then(
                                (complete) => {
                                    setShowModal(false);
                                    setIsLoading(false);
                                },
                                () => {
                                    alert(
                                        "Unable to delete removed categories in Providers",
                                    );
                                },
                            );
                        },
                        () => {
                            // code that takes care of the canceled promise.
                            // Note that .then rather than .done should be used in this case.
                            alert("Unable to save Providers");
                        },
                    );
                });
        } catch {
            alert("Unable to load Providers");
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
            {(document.cookie == "" || document.cookie == null) && (
                <TempTutorial />
            )}
            {document.cookie.includes("tut=true") &&
                !isEmpty(categories) &&
                !document.cookie.includes("tut2") && <TempTutorialTwo />}
            <Container className="box">
                <div className="row-spaced">
                    <h2 className="template-title">Template Builder</h2>
                </div>
                {/* <div className="primary-slider">
                    <div className="primary-slider-button">
                    <p className="primary-slider-text">Enable Primary Single Select Filter</p>
                    <ToggleSlider flip={usePrimary} onToggle={(e) => setUsePrimary(!usePrimary)}/>
                    </div>
                    <p className="primary-slider-desription">Activate to create a single filtering group where you can color code the options. We recommend if you have a primary filtering group.</p>
                </div>
                <br /> */}
                {message != null && <p style={{ color: "green" }}>{message}</p>}
                <div className="template-header">
                    <h3 className="template-header-title">Filters</h3>
                    <p className="template-header-desription">The top 3 filters will be directly displayed under search in desktop view. Additional filters will be accessible under ‘More filters’ </p>
                </div>
                <InputGroup>
                    {/* <FormControl
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
                    </InputGroup.Append> */}
                </InputGroup>
                <br />
                {usePrimary? (
                <div>
                    {categories
                    .filter(
                        (item, value) => item.isPrimary)
                    .sort(
                        ([aKey, aValue]: any[], [bKey, bValue]: any[]) =>
                            aValue.priority - bValue.priority
                    )
                    .map((item, index) => (
                        <p>
                            <PrimaryCell
                                item={item}
                                index={index}
                                disableCat={disableCat}
                                enableCat={enableCat}
                                deleteCat={deletePrim}
                                changeType={changeType}
                                rename={rename}
                                addOption={addPrimOption}
                                changeColor={changeColor}
                                removeOption={removeOption}
                            />
                        </p>
                    ))
                    }
                </div>) :(<></>)}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {categories
                                .filter(
                                    (item, value) => !item.isPrimary)
                                // .sort(
                                //     ([aKey, aValue]: any[], [bKey, bValue]: any[]) =>
                                //         aValue.priority - bValue.priority
                                // )
                                .map((item, index) => (
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
                <button className="template-add"
                onClick={(e) => {
                    createNewCat();
                }}>
                <BsPlus /> Add Filter
                </button>
                <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="myModal" scrollable>
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
