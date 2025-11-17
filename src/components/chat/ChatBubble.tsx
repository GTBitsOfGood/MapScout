import React from "react";

function ChatBubble({ item }) {
  const dateObj = item.timestamp ? new Date(item.timestamp) : null;
  return (
    <div
      className="chat-bubble"
      style={{
        alignSelf: item.fromSlack ? 'flex-start' : 'flex-end',
        backgroundColor: item.fromSlack ? "#C2DCFF" : "#CECECE",
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        borderBottomLeftRadius: item.fromSlack ? '0px' : '20px',
        borderBottomRightRadius: item.fromSlack ? '20px' : '0px',
      }}
    >
      <div className="chat-message">{item.message}</div>
      {dateObj ? <div className="chat-time">{dateObj.toLocaleString()}</div> : <></>}
    </div>
  );
}

export default ChatBubble;
