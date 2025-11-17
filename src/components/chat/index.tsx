import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "firebase/database";
import { chatRef } from "../../store";
import Discussion from "./Discussion";
import { updateNewChat as Update } from "../../functions/reduxActions";
import ChatBubble from "./ChatBubble";
import { SendIcon } from "components/dashboard/TextComponent/Icons";

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
    fetch("https://bit-bot-iota.vercel.app/bog/mapscout", requestOptions);
}

const addToDo = (newToDo) => {
    return chatRef.push().set(newToDo);
};

function Chat({firebase}) {
    const [message, setMessage] = useState("");

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
            await addToDo({
                message: "Thanks for your message, we will reach out to you shortly with an update!",
                fromSlack: true,
                uid: firebase.auth.uid,
                username: firebase.auth.email,
            });
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
                    <Form onSubmit={formSubmit} id="chat-input-container">
                        <Form.Control
                            id="chat-input"
                            placeholder="Enter message..."
                            as="textarea"
                            value={message}
                            onChange={inputChange}
                        />
                        <Button
                            id="chat-send-button"
                            type="submit"
                            value="submit"
                            variant="primary"
                            disabled={message === ""}
                        >
                            <SendIcon />
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
