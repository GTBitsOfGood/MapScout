import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Discussion from './Discussion';
import 'firebase/database';
import { chatRef } from '../../store';

const testData = [
  {
    message: 'Yeet',
    timestamp: '2020-07-16T02:24:26Z',
  },
  {
    message: 'Yeet2',
    timestamp: '2020-07-16T02:25:19Z',
  },
];

function Chat() {
  const [message, setMessage] = useState('');
  const addToDo = async (newToDo) => {
    chatRef.push().set(newToDo);
  };

  const inputChange = (e) => {
    setMessage(e.target.value);
  };

  const formSubmit = () => {
    const currentdate = new Date();
    const datetime = `Last Sync: ${currentdate.getDate()}/${
      currentdate.getMonth() + 1}/${
      currentdate.getFullYear()} @ ${
      currentdate.getHours()}:${
      currentdate.getMinutes()}:${
      currentdate.getSeconds()}`;
    addToDo({
      message,
      timestamp: datetime,
      uid: 'luke',
      username: 'luke',
    });
    setMessage('');
  };

  return (
    <div id="template-root">
      <Container className="box">
        <h2>Feedback</h2>
        <div style={{ color: 'grey' }}>
          Anything you want the team to know?
          {' '}
          <b>Bugs?</b>
          {' '}
          <b>Suggestions?</b>
          {' '}
          Please message us here.
        </div>
        <Discussion chats={testData} />
        <Form onSubmit={formSubmit}>
          <Form.Control
            placeholder="Enter message"
            as="textarea"
            rows="3"
            onChange={inputChange}
          />
          <div className="row-spaced">
            <p className="pt-2" style={{ color: 'lightgray' }}>Press enter to send</p>
            <Button
              type="submit"
              value="submit"
              variant="link"
            >
              SEND
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Chat;
