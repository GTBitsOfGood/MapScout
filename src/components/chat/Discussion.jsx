import React, { useEffect, useState, useRef } from 'react';
import 'firebase/database';
import ChatBubble from './ChatBubble';
import { databaseRef } from '../../store';
import {connect} from 'react-redux';

function Discussion({ chatHistory }) {
  const [data, setData] = useState(chatHistory);
  const [height, setHeight] = useState(0);
  const root = useRef(null);

  useEffect(() => {
    if (root.current) {
      setHeight(root.current.clientHeight);
    }
  });

  useEffect(() => {
    setData(chatHistory);
  }, [chatHistory]);

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
