import React, { useState, useEffect } from "react";
import { isEmpty, isLoaded, withFirestore } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import YouTube, { Options } from "react-youtube";
import { authRoute, providerRoute } from "../../routes/pathnames";
import Modal from "react-bootstrap/Modal";
import ModalRoot from "components/modals/ModalRoot";
import "../modals/Modal.css";
import { features } from "./features";

const logo = require("../../assets/img/logo.png");
const background = require("../../assets/img/homepage-hero.png");

const opts: Options = {
    width: "100%",
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
    },
};

function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()) == true) {
        console.log("click this button");
    }
    return re.test(String(email).toLowerCase());
}

async function sendSlackMessage(email) {
    const data = {
        email: email
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };
    fetch("https://bit-bot-five.vercel.app/bog/mapscout", requestOptions)
}

function Home({ firebaseAuth, firestore }) {
    const [showProviderRoutes, setShowProviderRoutes] = useState(false);
    const [email, setEmail] = useState("");
    const [emailDisabled, setEmailDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showEmailBtnModal, setShowEmailBtnModal] = useState(false);

    const addModal = () => {
        setShowEmailModal(true);
    };

    useEffect(() => {
        if (
            isLoaded(firebaseAuth) &&
            !isEmpty(firebaseAuth.auth) &&
            !showProviderRoutes
        ) {
            setShowProviderRoutes(true);
        } else if (showProviderRoutes) {
            setShowProviderRoutes(false);
        }
    }, [firebaseAuth]);

    useEffect(() => {
        if (!validateEmail(email) || emailDisabled) setEmailDisabled(false);
        else {
            setEmailDisabled(true);
            setShowEmailBtnModal(true);
        }
    }, [email]);

    async function handleSubmit() {
        const payload = { email };
        setEmailDisabled(true);
        firestore
            .set({ collection: "waitlist", doc: email }, payload)
            .then(() => {
                setEmail("");
                setEmailDisabled(false);
                setMessage("Thank you for signing up!");
            });

        await sendSlackMessage(email);
    }

    return (
        <>
            <div id="homepage-root">
                <span id="homepage-background">
                    <img src={background} alt="background" />
                </span>
                <div style={{ position: "relative", zIndex: 1 }}>
                    <header id="head" className="row-spaced">
                        <span id="head-logo">
                            <b>MapScout</b> <img src={logo} alt="logo" />
                        </span>
                        <a href="https://www.netlify.com">
                            <img
                                src="https://www.netlify.com/v3/img/components/netlify-dark.svg"
                                alt="Deploys by Netlify"
                            />
                        </a>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" , gap:"20px", alignItems: "center" }}>
                            <a href="https://bitsofgood.org/contact/" style={{ color: "black" }}>
                                <b>Contact Us</b>
                            </a>
                            <a href="https://bitsofgood.org/about/" style={{ color: "black" }}>
                                <b>About Us</b>
                            </a>
                            
                            <Button
                                as={Link}
                                to={showProviderRoutes ? providerRoute : authRoute}
                            >
                                {showProviderRoutes ? "Go to Dashboard" : "Login"}
                            </Button>
                        </div>
                    </header>
                    <section id="homepage-body">
                        <div className="homepage-col">
                            <h1>
                                <b>
                                    Create{" "}
                                    <span style={{ color: "#0269D9" }}>
                                        beautiful
                                    </span>{" "}
                                    resource maps.
                                </b>
                            </h1>
                            <p>
                                MapScout makes it <b>simple</b> to build and
                                customize your own interactive resource map. Our
                                unique template builder gives you{" "}
                                <b>complete control</b> over the information and
                                search filters you present.
                            </p>
                            <ul style={{ marginLeft: 20 }}>
                                <li>Completely free for nonprofits</li>
                                <li>100% customer satisfaction</li>
                                <li>Mobile friendly</li>
                            </ul>
                            <Form.Group
                                controlId="formEmail"
                                style={{
                                    backgroundColor: "#F3F3F3",
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 12,
                                    paddingBottom: 12,
                                }}
                            >
                                <Form.Label>
                                    Add your name to our waitlist today
                                </Form.Label>
                                <InputGroup>
                                    <ModalRoot />
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        //onClick={addModal}
                                        placeholder="name@example.com"
                                        aria-label="Sign up for our waitlist"
                                        aria-describedby="emailSignup"
                                    />
                                    <Modal
                                        //show={showEmailBtnModal}
                                        onHide={() =>
                                            setShowEmailBtnModal(false)
                                        }
                                        dialogClassName="email-btn-modal"
                                        aria-labelledby="example-custom-modal-styling-title"
                                    >
                                        <div className="modal-body">
                                            Press this Button
                                        </div>
                                    </Modal>
                                    <InputGroup.Append>
                                        <Button
                                            disabled={
                                                emailDisabled ||
                                                !validateEmail(email)
                                            }
                                            onClick={handleSubmit}
                                            id="emailSignup"
                                        >
                                            Signup
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                                <Form.Text muted>{message}</Form.Text>
                            </Form.Group>
                        </div>
                        <div className="homepage-col">
                            <YouTube
                                id="youtube"
                                videoId="HVVHiNPZ88A"
                                opts={opts}
                            />
                        </div>
                    </section>
                </div>
            </div>
            <Modal
                show={showEmailModal}
                onHide={() => setShowEmailModal(false)}
                dialogClassName="email-modal"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <div className="modal-body">hello</div>
            </Modal>
            {features.map((feature, index) => (
                <section
                    id="product"
                    key={index}
                    style={{
                        backgroundColor: index % 2 === 1 ? '#ffffff' : '#E9D5FF',
                        padding: '2rem 0',
                    }}
                >
                <div style={{display: index % 2 === 1 ? 'flex-row' : 'flex-row-reverse'}}>
                    <h1 className="mb-4 max-w-xl font-semibold text-purple-700">
                    {feature.title}
                    </h1>
                    <p className="mb-0 max-w-xl">{feature.description}</p>
                </div>
                <div className="m-2 flex flex-1 items-center justify-center">
                    <img style={{ maxHeight: '100%', maxWidth: '100%' }} src={feature.imageUrl} />
                </div>
                </section>
            ))}
        </>
    );
}

const mapStateToProps = (state) => ({
    firebaseAuth: state.firebase,
});

export default compose<any>(
    withFirestore,
    connect(mapStateToProps, null)
)(React.memo(Home));
