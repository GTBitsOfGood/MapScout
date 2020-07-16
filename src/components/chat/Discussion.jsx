import React, { useEffect, useState } from 'react';
import 'firebase/database';
import ChatBubble from './ChatBubble';
import { databaseRef } from '../../store';

function Discussion({ uid }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  async function updateChat(payload, payload2) {
    const chats = Object.values(payload).filter((x) => x.uid && x.uid === uid);
    const responses = Object.values(payload2).filter((x, i) => {
      const index = x.message.indexOf(`$${uid}`);
      if (index >= 0) {
        x.message = x.message.replace(`$${uid}`, '').trim();
      }
      return index >= 0;
    });
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
      updateChat(
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
    <div id="discussion-root">
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
  );
}

export default Discussion;
