import { connect } from "react-redux";
import { compose } from "redux";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { withFirestore } from "react-redux-firebase";
import { formRoute } from "../../routes/pathnames";
import { selectItem } from "../../functions/reduxActions";
import { useCSVReader } from "react-papaparse";
import Modal from "react-bootstrap/Modal";
import handleDrop from "./CSV";
import importConfig from "./CSV";
import handleRemoveFile from "./CSV";
import handleSubmit from "./CSV";
import { Container } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import Collapsible from "components/collapsible";
import { ProviderProps } from "types/firestore";
import ProviderInfo from "components/subcomponents/ProviderInfo";

function ProviderEntry({ provider, setLoading, resetIndex, firestore, selectItem, categories }: { provider: ProviderProps, setLoading: Function, resetIndex: Function, firestore: any, selectItem: Function, categories: Array<String> }) {
    return <Collapsible
        style={{ width: "100%", borderRadius: "8px" }}
        title={
            <div className="provider-entry">
                {/* title */}
                <div style={{ fontSize: "20px" }}>
                    <b>{provider.facilityName}</b>
                </div>
                {/* Info */}
                <div style={{ marginLeft: "15px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{
                            width: "calc(100% - 200px",
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', gap: "10px"
                        }}>
                            {provider.address}
                        </div>
                        <div>
                            <Button
                                style={{ width: "90px", height: "35px", backgroundColor: "#226DFF" }}
                                block
                                variant="primary"
                                onClick={() => selectItem(provider)}
                                as={Link}
                                to={formRoute}
                            >
                                Edit
                            </Button>
                        </div>
                        <div>
                            <Button
                                style={{ width: "90px", height: "35px", backgroundColor: "#fd2c63" }}
                                block
                                variant="danger"
                                onClick={async () => {
                                    setLoading();
                                    const collections =
                                        firestore.collection("providers");
                                    await collections
                                        .where("id", "==", provider.id)
                                        .get()
                                        .then(async (querySnapshot) => {
                                            await querySnapshot.forEach((doc) => {
                                                doc.ref.delete();
                                            });
                                        });
                                    await firestore.get("providers");
                                    resetIndex();
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                    <div>
                        {provider.phoneNum}
                    </div>
                </div>
            </div>
        }
        defaultState={false}
    >
        <Container>
            <ProviderInfo item={provider} categories={categories} />
        </Container>
    </Collapsible>

}

function Dashboard({ firestore, team, selectItem }) {
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
        fetchData()
        sessionStorage.clear()
        setIsLoading(false);
    }, [team, isLoading]);

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
                    {/* <img src={dash} alt="empty dash" /> */}
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
        <div id="template-root">
            <Container className="box">
                <div className="row-spaced">
                    <h2 className="template-title">Providers Builder</h2>
                </div>
                <div className="template-header">
                    <h3 className="template-header-title">Providers</h3>
                    <p className="template-header-desription">
                        The providers will appear on the Map where
                        the users will be able to click on them and
                        view more information about them.
                    </p>
                </div>
                <br />
                <div className="provider-container">
                    {providers.map((provider, i) =>
                        <ProviderEntry
                            provider={provider}
                            setLoading={() => setIsLoading(true)}
                            resetIndex={() => {
                                setIsLoading(false);
                            }}
                            firestore={firestore}
                            selectItem={selectItem}
                            categories={categories}
                        />
                    )}
                </div>
                <button className="template-add">
                    <Link onClick={() => selectItem({})} to={formRoute} style={{ width: "100%" }}>
                        <BsPlus /> Add New Provider
                    </Link>
                </button>
                {/* Bandaid fix for content showing below sticky button */}
                <div style={{ marginBottom: "-18px", height: "18px", width: "100%", position: "sticky", bottom: "-28px", backgroundColor: "white", zIndex: "2" }} />
            </Container>
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
