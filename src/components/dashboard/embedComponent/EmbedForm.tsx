import React, { useState } from 'react';
import Collapsible from "components/collapsible"; 
import InfoAlert from './InfoAlert';

const EmbedForm: React.FC = () => {
  const [embedLink, setEmbedLink] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [width, setWidth] = useState<number>(640);
  const [height, setHeight] = useState<number>(360);

  return (
    <Collapsible label="Embed"> 
      <div style={styles.formContainer}>
        {/* <h3 style={styles.header}>Embed</h3> */}
        <div style={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Embed Link *</label>
          <textarea
            placeholder="ex. <iframe>...</iframe>"
            value={embedLink}
            onChange={(e) => setEmbedLink(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div style={styles.info}>
          <InfoAlert />
        </div>

        <div style={styles.dimensionsContainer}>
          <div style={styles.dimensionGroup}>
            <label>Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              style={styles.dimensionInput}
            />
          </div>
          <div style={styles.dimensionGroup}>
            <label>Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              style={styles.dimensionInput}
            />
          </div>
        </div>
        <label style={styles.deleteLabel}>Delete</label>
      </div>
    </Collapsible>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  formContainer: {
    width: '100%',
    maxWidth: '800px',
    height: 'auto',
    minHeight: '400px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  header: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#226DFF',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    height: '60px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  info: {
    fontSize: '12px',
    color: '#F0F4FA',
    marginBottom: '15px',
  },
  dimensionsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '20px',
    marginBottom: '15px',
  },
  dimensionGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dimensionInput: {
    width: '80px',
    padding: '6px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    textAlign: 'center',
    marginTop: '5px',
  },
  deleteLabel: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    color: '#f44336',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

export default EmbedForm;
