import React from 'react';
import { InfoCircleFill } from 'react-bootstrap-icons';

const InfoAlert = () => {
  return (
    <div style={styles.alertBox}>
      <InfoCircleFill style={styles.icon} size={20} /> 
      <span style={styles.text}>
        The recommended width and height for media embeds are 640x360 and 480x270.
      </span>
    </div>
  );
};

const styles = {
  alertBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f9ff', 
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #dfe7f3', 
  },
  icon: {
    color: '#1d72e8', 
    fill: '#1d72e8',  
    marginRight: '10px',
  },
  text: {
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default InfoAlert;
