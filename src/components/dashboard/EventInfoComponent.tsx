import React from "react";
import './EventInfoComponent.css'; // Import CSS for styling
import Collapsible from 'components/collapsible'; 

interface EventInfoComponentProps {
  title: string;
  description: string;
  highlight: string;
}

const EventInfoComponent: React.FC<EventInfoComponentProps> = ({ title, description, highlight }) => {
  return (
    <Collapsible label={title}> {/* Wrapping everything inside the collapsible */}
      <div className="event-info-container">
        <p className="event-description">{description}</p>
        <p className="event-highlight">{highlight}</p>
      </div>
    </Collapsible>
  );
};

export default EventInfoComponent;
