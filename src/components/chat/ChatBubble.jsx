import React from 'react';

function ChatBubble({ isEnd, isStart, item }) {
  const dateObj = new Date(item.timestamp);
  return (
    <div
      className="chat-bubble"
      style={{
        alignSelf: item.fromSlack ? 'flex-start' : 'flex-end',
        borderColor: item.fromSlack ? 'limegreen' : '#E5E5E5',
        borderTopLeftRadius: !isStart ? 0 : 30,
        borderTopRightRadius: !isStart ? 0 : 30,
        borderTopWidth: !isStart ? 0 : 8,
        borderBottomLeftRadius: item.fromSlack ? 0
          : !isEnd ? 0 : 30,
        borderBottomRightRadius: !item.fromSlack ? 0
          : !isEnd ? 0 : 30,
      }}
    >
      <div className="chat-message">{item.message}</div>
      <div className="chat-time">{dateObj.toLocaleString()}</div>
    </div>
  );
}

export default ChatBubble;
