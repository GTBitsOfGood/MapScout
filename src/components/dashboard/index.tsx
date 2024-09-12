import { connect } from "react-redux";
import { compose } from "redux";
import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { withFirestore, isEmpty } from "react-redux-firebase";
import { formRoute } from "../../routes/pathnames";
import SingleProvider from "./SingleProvider";
import { selectItem } from "../../functions/reduxActions";
import CSV from "./CSV";
import { DashTutorial } from "./DashTutorial";
import { useCSVReader } from "react-papaparse";
import Modal from "react-bootstrap/Modal";
import handleDrop from "./CSV";
import importConfig from "./CSV";
import handleRemoveFile from "./CSV";
import handleSubmit from "./CSV";
import Collapsible from "components/collapsible";

const dash = require("../../assets/img/dash.svg");

function Dashboard({ firestore, team, selectItem }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [show, setShow] = React.useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const { CSVReader } = useCSVReader();

    useEffect(() => {
        async function fetchData() {
            if (team && team.name) {
                const collections = firestore.collection("categories");
                const c = await collections
                    .where("team", "==", team.name)
                    .get()
                    .then((querySnapshot) => {
                        const arr = [];
                        querySnapshot.forEach((doc) => {
                            const docData = doc.data();
                            arr.push(docData);
                        });
                        return arr;
                    });
                const collections2 = firestore.collection("providers");
                const p = await collections2
                    .where("team", "==", team.name)
                    .get()
                    .then((querySnapshot) => {
                        const arr = [];
                        querySnapshot.forEach((doc) => {
                            const docData = doc.data();
                            arr.push(docData);
                        });
                        return arr;
                    });
                setProviders(p);
                setCategories(c);
            }
        }
        fetchData().then(() => setIsLoading(false));
    }, [team]);

    if (isLoading) {
        return (
            <div className="spinner-wrap">
                <div className="spinner" />
            </div>
        );
    }

    if (providers.length == 0) {
        return (
            <div
                style={{
                    paddingTop: "50px",
                    margin: "auto",
                }}
                className="admin-list-container"
            >
                <div className="list-wrapper">
                    <img src={dash} alt="empty dash" />
                    <h1
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            paddingBottom: "20px",
                        }}
                    >
                        Fill your map!
                    </h1>
                    <h1
                        style={{
                            fontWeight: "lighter",
                            fontSize: "20px",
                            textAlign: "center",
                            paddingBottom: "30px",
                        }}
                    >
                        You have no resources... Add some.
                    </h1>

                    <Button
                        block
                        variant="primary"
                        onClick={() => selectItem({})}
                        as={Link}
                        to={formRoute}
                        style={{
                            margin: "auto",
                            display: "inline-flex",
                            height: "70px",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            fontWeight: "bold",
                        }}
                    >
                        Add New Provider
                    </Button>

                    <Button
                        id="dropdown-split-variants-secondary"
                        variant="primary"
                        title="Import CSV"
                        block
                        style={{
                            display: "inline-flex",
                            height: "70px",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            paddingTop: "5px",
                            fontWeight: "bold",
                        }}
                        onClick={handleShow}
                    >
                        Import CSV
                    </Button>
                    <Modal size="lg" show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Import CSV</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CSVReader
                                onDrop={handleDrop}
                                config={importConfig}
                                addRemoveButton
                                onRemoveFile={handleRemoveFile}
                            >
                                <span>
                                    Drop CSV file here or click to upload 1.
                                </span>
                            </CSVReader>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Exit
                            </Button>
                            <Button variant="primary" onClick={handleSubmit}>
                                Upload
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <DashTutorial />
            <div className="admin-list-container">
                <div className="list-wrapper">
                    <div className="add-export-bttns-wrapper">
                        <div className="add-button-wrapper">
                            <Button
                                block
                                variant="primary"
                                onClick={() => selectItem({})}
                                as={Link}
                                to={formRoute}
                            >
                                + Add New Provider
                            </Button>
                        </div>
                        <div className="export-button-wrapper">
                            <CSV
                                providers={providers}
                                categories={categories}
                            />
                        </div>
                    </div>
                    <div
                        className="scroll-container"
                        style={{ maxHeight: "calc(100vh - 66px)" }}
                    >
                        <ListGroup variant="flush">
                            {!isEmpty(providers) &&
                                providers.map((item, index) => (
                                    <ListGroup.Item
                                        href={item.id}
                                        key={index}
                                        className="point"
                                        onClick={() => setSelectedIndex(index)}
                                        active={selectedIndex === index}
                                    >
                                        <h2>{item.facilityName}</h2>
                                    </ListGroup.Item>
                                ))}
                        </ListGroup>
                    </div>
                </div>
            </div>
            <div className="admin-provider">
                {providers && providers[selectedIndex] && (
                    <SingleProvider
                        item={providers[selectedIndex]}
                        categories={categories}
                        editProvider={() =>
                            selectItem(providers[selectedIndex])
                        }
                        setLoading={() => setIsLoading(true)}
                        resetIndex={() => {
                            setSelectedIndex(0);
                            setIsLoading(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

const mapDispatchToProps = {
    selectItem,
};

const mapStateToProps = (state) => ({
    firebase: state.firebase,
    team: state.item.team,
});

export default compose<any>(
    withFirestore,
    connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
