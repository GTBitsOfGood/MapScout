import React, { useEffect, useState, useRef } from 'react';
import 'firebase/database';
import ChatBubble from './ChatBubble';
import { databaseRef } from '../../store';
import {connect} from 'react-redux';

function Discussion({ uid, chatHistory }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(chatHistory);
  const [height, setHeight] = useState(0);
  const root = useRef(null);

  useEffect(() => {
    if (root.current) {
      setHeight(root.current.clientHeight);
    }
  });

  async function parseChat(payload, payload2) {
    const chats = payload ? Object.values(payload).filter((x) => x.uid && x.uid === uid) : [];
    const responses = payload2 ? Object.values(payload2).filter((x) => {
      const index = x.message.indexOf(`$${uid}`);
      if (index === 0) {
        x.message = x.message.replace(`$${uid}`, '').trim();
      }
      return index === 0;
    }) : [];
    const arr = [];
    while (chats.length > 0 && responses.length > 0) {
      const chatTarget = chats[chats.length - 1];
      const responseTarget = responses[responses.length - 1];
      const chatDate = new Date(chatTarget.timestamp);
      const responseDate = new Date(responseTarget.timestamp);
      if (chatDate > responseDate) {
        arr.push(chatTarget);
        chats.pop();
      } else if (chatDate < responseDate) {
        arr.push(responseTarget);
        responses.pop();
      } else {
        arr.push(chatTarget);
        chats.pop();
        arr.push(responseTarget);
        responses.pop();
      }
    }
    if (chats.length > 0) {
      arr.push(...chats);
    } else if (responses.length > 0) {
      arr.push(...responses);
    }
    setData(arr);
  }

  useEffect(() => {
    databaseRef.on('value', (snapshot) => {
      setIsLoading(true);
      parseChat(
        snapshot.child('chat').val(),
        snapshot.child('response').val(),
      ).then(setIsLoading(false));
    });
  }, []);

  if (isLoading) {
    return (
      <div className="spinner-wrap mb-5">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div id="discussion-root" ref={root}>
      {
        height >= 440
        && <div className="veil" />
      }
      <div id="discussion-scroll">
        {
          data && data.map((item, index) => (
            <ChatBubble
              isEnd={
                index <= 0
                || data[index - 1].fromSlack !== item.fromSlack
              }
              isStart={
                index >= data.length - 1
                || data[index + 1].fromSlack !== item.fromSlack
              }
              item={item}
            />
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  chatHistory: state.item.chatHistory,
});

export default connect(mapStateToProps, null)(Discussion);