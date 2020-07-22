import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'firebase/database';
import { chatRef } from '../../store';
import { updateNewChat } from '../ProviderRoutes';
import Discussion from './Discussion';

function Chat({ firebase }) {
  const [message, setMessage] = useState('');
  const addToDo = async (newToDo) => {
    chatRef.push().set(newToDo);
  };

  const inputChange = (e) => {
    setMessage(e.target.value);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    if (message !== '') {
      const currentdate = new Date();
      const datetime = currentdate.toISOString();
      addToDo({
        message,
        timestamp: datetime,
        uid: firebase.auth.uid,
        username: firebase.auth.email,
      }).then(setMessage(''));
    }
  };

  useEffect(() => {
    updateNewChat(false);
    
  }, []);

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
        <div className="mr-5 ml-5">
          <Discussion uid={firebase.auth.uid} />
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
              disabled={message === ''}
            >
              SEND
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  firebase: state.firebase,
});

export default connect(mapStateToProps, null)(Chat);
