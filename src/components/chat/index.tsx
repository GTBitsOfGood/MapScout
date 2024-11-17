import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "firebase/database";
import { chatRef } from "../../store";
import Discussion from "./Discussion";
import { updateNewChat as Update } from "../../functions/reduxActions";

async function sendSlackMessage(email, message) {
    const data = {
        email: email + "; Feedback: " + message,
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    fetch("https://bit-bot-five.vercel.app/bog/mapscout", requestOptions);
}

const addToDo = (newToDo) => {
    return chatRef.push().set(newToDo);
};

function Chat({firebase}) {
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const inputChange = (e) => {
        setMessage(e.target.value);
    };
    
    const formSubmit = async (e) => {
        e.preventDefault();
        if (message !== "") {
            const currentdate = new Date();
            const datetime = currentdate.toISOString();
            await addToDo({
                message,
                timestamp: datetime,
                uid: firebase.auth.uid,
                username: firebase.auth.email,
            });
            await sendSlackMessage(firebase.auth.email, message);
            // Keep the state updates after all the async functions are done!
            // For some reason, updating them first causes them to not update the state
            setIsSubmitted(true);
            setMessage("");
        }
    };

    return (
        <div id="template-root">
            <Container className="box">
                <h2>Feedback</h2>
                <div style={{ color: "grey" }}>
                    Anything you want the team to know? <b>Bugs?</b>{" "}
                    <b>Suggestions?</b> Please message us here.
                </div>
                <div className="mr-5 ml-5">
                    <Discussion />
                    { isSubmitted && (
                        <div
                        className="chat-bubble"
                        style={{
                            alignSelf: "flex-start",
                            borderColor: "#E5E5E5",
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            borderTopWidth: 8,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 30,
                            marginBottom: 6
                        }}
                    >
                        <div className="chat-message">Thanks for your feedback, we have recieved your message, our team will reach out to you shortely!</div>
                    </div>
                    )}
                    <Form onSubmit={formSubmit}>
                        <Form.Control
                            placeholder="Enter message"
                            as="textarea"
                            rows="3"
                            value={message}
                            onChange={inputChange}
                        />
                        <Button
                            className="mt-2 pl-5 pr-5"
                            type="submit"
                            value="submit"
                            variant="primary"
                            disabled={message === ""}
                        >
                            SEND
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
}

const mapDispatchToProps = {
    updateNewChat: Update,
};

const mapStateToProps = (state) => ({
    firebase: state.firebase,
    newChat: state.item.newChat,
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
