import React from "react";
import './EventInfoComponent.css';

interface EventInfoComponentProps {
  description: string;
}

const EventInfoComponent: React.FC<EventInfoComponentProps> = ({ description }) => {
  return (
    <p dangerouslySetInnerHTML={{ __html: description }} className="event-description"/>
  );
};

export default EventInfoComponent;
