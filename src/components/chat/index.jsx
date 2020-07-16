import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Discussion from './Discussion';

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

function handleSubmit(e) {
  e.preventDefault();
  console.log('MEOW');
}

function Chat() {
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
        <Form onSubmit={handleSubmit}>
          <Form.Control
            placeholder="Enter message"
            as="textarea"
            rows="3"
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
