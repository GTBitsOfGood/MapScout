import { connect } from "react-redux";
import { compose } from "redux";
import React, { useState, useEffect } from "react";
import Steps, { Step } from "rc-steps";
import "rc-steps/assets/index.css";
import "rc-steps/assets/iconfont.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { withFirestore } from "react-redux-firebase";
import {
    isValidNumberForRegion,
    parseIncompletePhoneNumber,
} from "libphonenumber-js";
import RowForm from "./RowForm";
import { providerRoute } from "../../routes/pathnames";
import useWindowSize from "../../functions/useWindowSize";
import promiseWithTimeout from "../../functions/promiseWithTimeout";
import { GOOGLE_API_KEY } from "../../config/keys";
import { storage } from "../../store";
import { Store } from "reducers/types";
const { v4: uuidv4 } = require("uuid");

let steps = [
    "Map",
    "Hours",
    "Tag",
    "Text",
    // 'Toggle', disabled due to lack of use, this is designed for singleselect filters, feature however, is not implemented
    // 'Actions'
    "Content",
];

function AddProvider(props) {
    const { width } = useWindowSize();
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [animate, setAnimate] = useState(true);
    const [item, setItem] = useState(props.selected || {});
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState(null);
    const [descriptions, setDescriptions] = useState(null);
    const [single, setSingle] = useState(null);
    const [error, setError] = useState("");

    // async function fetchData() {
    //   const collections = props.firestore.collection('categories');
    //   const f = await collections
    //     .where('team', '==', props.team.name)
    //     .where('active', '==', true)
    //     .where('select_type', '==', 2)
    //     .get()
    //     .then((querySnapshot) => {
    //       const idToData = {};
    //       querySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         idToData[doc.id] = {
    //           name: data.name,
    //           options: data.options,
    //         };
    //       });
    //       return idToData;
    //     });
    //   const d = await collections
    //     .where('team', '==', props.team.name)
    //     .where('active', '==', true)
    //     .where('select_type', '==', 0)
    //     .get()
    //     .then((querySnapshot) => {
    //       const idToData = {};
    //       querySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         idToData[doc.id] = {
    //           name: data.name,
    //           options: data.options,
    //         };
    //       });
    //       return idToData;
    //     });
    //   const c = await collections
    //     .where('team', '==', props.team.name)
    //     .where('active', '==', true)
    //     .where('select_type', '==', 1)
    //     .get()
    //     .then((querySnapshot) => {
    //       const idToData = {};
    //       querySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         idToData[doc.id] = {
    //           name: data.name,
    //           options: data.options,
    //         };
    //       });
    //       return idToData;
    //     });
    //   setFilters(f);
    //   setDescriptions(d);
    //   setCategories(c);
    // }

    useEffect(() => {
        async function fetchData() {
            const collections = props.firestore.collection("categories");
            const f = await collections
                .where("team", "==", props.team.name)
                .where("active", "==", true)
                .where("select_type", "==", 1)
                .get()
                .then((querySnapshot) => {
                    const idToData = {};
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        idToData[doc.id] = {
                            name: data.name,
                            options: data.options,
                        };
                    });
                    return idToData;
                });
            const d = await collections
                .where("team", "==", props.team.name)
                .where("active", "==", true)
                .where("select_type", "==", 0)
                .get()
                .then((querySnapshot) => {
                    const idToData = {};
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        idToData[doc.id] = {
                            name: data.name,
                            options: data.options,
                        };
                    });
                    return idToData;
                });
            const c = await collections
                .where("team", "==", props.team.name)
                .where("active", "==", true)
                .where("select_type", "==", 2)
                .get()
                .then((querySnapshot) => {
                    const idToData = {};
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        idToData[doc.id] = {
                            name: data.name,
                            options: data.options,
                        };
                    });
                    return idToData;
                });
            setFilters(f);
            setDescriptions(d);
            setSingle(c);
        }
        fetchData().then(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        function updateSteps() {
            if (filters && !Object.keys(filters).length) {
                const delIndex = steps.indexOf("Tag");
                delIndex !== -1 && steps.splice(delIndex, 1);
            }

            if (descriptions && !Object.keys(descriptions).length) {
                const delIndex = steps.indexOf("Text");
                delIndex !== -1 && steps.splice(delIndex, 1);
            }

            if (single && !Object.keys(single).length) {
                const delIndex = steps.indexOf("Toggle");
                delIndex !== -1 && steps.splice(delIndex, 1);
            }
        }

        updateSteps();
    }, [filters, descriptions, single]);

    // function updateSteps() {
    //   if (filters && !Object.keys(filters).length) {
    //     const delIndex = steps.indexOf("Tag");
    //     delIndex !== -1 && steps.splice(delIndex, 1);
    //   }

    //   if (descriptions && !Object.keys(descriptions).length) {
    //     const delIndex = steps.indexOf("Text");
    //     delIndex !== -1 && steps.splice(delIndex, 1);
    //   }

    //   if (categories && !Object.keys(categories).length) {
    //     const delIndex = steps.indexOf("Toggle");
    //     delIndex !== -1 && steps.splice(delIndex, 1);
    //   }
    // }

    async function addFirestore() {
        setIsLoading(true);
        const i = {
            ...item,
            id: uuidv4(),
            team: props.team.name,
            latitude: null,
            longitude: null,
        };
        try {
            if (i.address[0] && i.address[0].length > 0) {
                const response = await promiseWithTimeout(
                    5000,
                    fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${i.address[0].replace(
                            /\s/g,
                            "%20",
                        )}&key=${GOOGLE_API_KEY}`,
                    ),
                );
                const responseJson = await response.json();
                if (
                    responseJson.results.length > 0 &&
                    responseJson.results[0].geometry.location
                ) {
                    i.latitude = responseJson.results[0].geometry.location.lat;
                    i.longitude = responseJson.results[0].geometry.location.lng;
                }
                if (!i.imageURL) {
                    const res = await fetch(
                        `https://maps.googleapis.com/maps/api/streetview?size=500x500&location=${i.latitude},${i.longitude}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}`,
                    );
                    const blob = await res.blob();
                    const filename = i.facilityName + ".jpeg";
                    await storage.ref("images").child(filename).put(blob);
                    await storage
                        .ref("images")
                        .child(filename)
                        .getDownloadURL()
                        .then((url) => {
                            i.imageURL = url;
                        });
                }
            }
            await promiseWithTimeout(
                5000,
                props.firestore.set(
                    { collection: "providers", doc: i.facilityName },
                    i,
                ),
            );
            props.history.push(providerRoute);
        } catch (e) {
            setError(
                "Failed to save changes. Please check your network connection or try again later.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function updateFirestore() {
        setIsLoading(true);
        const i = {
            ...item,
            latitude: null,
            longitude: null,
        };
        try {
            if (i.address[0] && i.address[0].length > 0) {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${i.address[0].replace(
                        /\s/g,
                        "%20",
                    )}&key=${GOOGLE_API_KEY}`,
                );
                const responseJson = await response.json();
                if (
                    responseJson.results.length > 0 &&
                    responseJson.results[0].geometry.location
                ) {
                    i.latitude = responseJson.results[0].geometry.location.lat;
                    i.longitude = responseJson.results[0].geometry.location.lng;
                }
                if (!i.imageURL) {
                    const res = await fetch(
                        `https://maps.googleapis.com/maps/api/streetview?size=500x500&location=${i.latitude},${i.longitude}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}`,
                    );
                    const blob = await res.blob();
                    const filename = i.facilityName + ".jpeg";
                    await storage.ref("images").child(filename).put(blob);
                    await storage
                        .ref("images")
                        .child(filename)
                        .getDownloadURL()
                        .then((url) => {
                            i.imageURL = url;
                        });
                }
            }
            const { firestore } = props;
            // here the item.id needs to be added to the google firebase console
            await firestore
                .get({ collection: "providers", where: ["id", "==", i.id] })
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        firestore.update(
                            { collection: "providers", doc: doc.id },
                            i,
                        );
                    });
                });
            await props.firestore.get("providers");
            props.history.push(providerRoute);
        } catch (e) {
            setError(
                "Failed to save changes. Please check your network connection or try again later.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    function next() {
        setStep(step + 1);
        setAnimate(false);
        setTimeout(() => setAnimate(true), 100);
    }

    function prev() {
        setStep(step - 1);
        setAnimate(false);
        setTimeout(() => setAnimate(true), 100);
    }

    if (isLoading) {
        return (
            <div className="spinner-wrap">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div>
            {error && (
                <Alert
                    variant="danger"
                    onClose={() => setError("")}
                    dismissible
                >
                    {error}
                </Alert>
            )}

            <Row className="align-items-start">
                <Col xs={12} md={4} lg={3}>
                    <div className="step-wrapper" style={{ marginTop: "64px" }}>
                        <Steps
                            current={step}
                            direction={width > 768 ? "vertical" : "horizontal"}
                            labelPlacement={
                                width > 768 ? "horizontal" : "vertical"
                            }
                        >
                            {steps.map((x) => (
                                <Step key={x} title={x} />
                            ))}
                        </Steps>
                        {width > 768 && (
                            <>
                                <br />
                                <Button
                                    block
                                    disabled={!completed}
                                    onClick={
                                        props.selected &&
                                        props.selected.facilityName
                                            ? updateFirestore
                                            : addFirestore
                                    }
                                >
                                    {props.selected &&
                                    props.selected.facilityName
                                        ? "Edit"
                                        : "Add"}{" "}
                                    Provider
                                </Button>
                                <Button
                                    as={Link}
                                    to={providerRoute}
                                    variant="link"
                                    block
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </Col>
                <Col xs={12} md={8} lg={9} style={{overflow: "scroll", height: "100vh"}}>
                    <Flipper flipKey={step}>
                        <Flipped flipId="form">
                            <div className="bg-white p-3">
                                <Flipped inverseFlipId="form" scale>
                                    <Form>
                                        <Row>
                                            <Col>
                                                <h2>{steps[step]} Info</h2>
                                            </Col>
                                            <Col xs="auto">
                                                <ButtonToolbar>
                                                    {step > 0 && (
                                                        <Button
                                                            onClick={prev}
                                                            variant="link"
                                                        >
                                                            Back
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={
                                                            step ===
                                                            steps.length - 1
                                                                ? props.selected &&
                                                                  props.selected
                                                                      .facilityName
                                                                    ? updateFirestore
                                                                    : addFirestore
                                                                : next
                                                        }
                                                        disabled={
                                                            !completed &&
                                                            step ===
                                                                steps.length - 1
                                                        }
                                                        variant="primary"
                                                    >
                                                        {step ===
                                                        steps.length - 1
                                                            ? props.selected &&
                                                              props.selected
                                                                  .facilityName
                                                                ? "Edit Provider"
                                                                : "Add Provider"
                                                            : "Next"}
                                                    </Button>
                                                </ButtonToolbar>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div>
                                            <div
                                                className={
                                                    animate ? "fade-in" : "hide"
                                                }
                                            >
                                                <RowForm
                                                    step={steps[step]}
                                                    item={item}
                                                    setItem={(i) => {
                                                        const c =
                                                            i.facilityName
                                                                .length > 0 &&
                                                            i.phoneNum[0] &&
                                                            isValidNumberForRegion(
                                                                parseIncompletePhoneNumber(
                                                                    i
                                                                        .phoneNum[0],
                                                                ),
                                                                "US",
                                                            );
                                                        setItem(i);
                                                        setCompleted(c);
                                                    }}
                                                    filters={filters}
                                                    descriptions={descriptions}
                                                    single={single}
                                                />
                                            </div>
                                        </div>
                                    </Form>
                                </Flipped>
                            </div>
                        </Flipped>
                    </Flipper>
                </Col>
            </Row>
        </div>
    );
}

export default compose<any>(
    withFirestore,
    connect((state: Store) => ({
        providers: state.firestore.ordered.providers,
        firebase: state.firebase,
        selected: state.item.selected,
        team: state.item.team,
    })),
)(AddProvider);
