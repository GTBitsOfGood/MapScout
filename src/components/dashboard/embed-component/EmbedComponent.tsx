import React, { useState } from 'react';
import ReactPlayer from 'react-player';

interface EventInfo {
  title: string,
  videoUrl: string;
  // thumbnail: string;
}

interface EmbedComponentProps {
  eventInfo: EventInfo;
}

const EmbedComponent: React.FC<EmbedComponentProps> = ({ eventInfo }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const DEFAULT_THUMBNAIL = "https://joeferry.com/wp-content/plugins/video-thumbnails/default.jpg";

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
      <div style={styles.innerContent}>
        {!isPlaying ? (
          <div style={styles.videoThumbnail} onClick={handlePlayVideo}>
            <img src={DEFAULT_THUMBNAIL} alt="Video thumbnail" style={styles.thumbnail} />
            <div style={styles.playButtonOverlay}>
              <div style={styles.circleButton}>
                <span style={styles.triangle}></span>
              </div>
            </div>
          </div>
        ) : (
          <ReactPlayer
            url={eventInfo.videoUrl}
            playing
            controls
            width="100%"
            height="315px"
            style={styles.videoPlayer}
          />
        )}
      </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  innerContent: {
    width: '100%',
    height: 'auto',
    padding: '15px',
  },
  videoThumbnail: {
    position: 'relative',
    cursor: 'pointer',
    display: 'inline-block',
    width: '100%',
    height: '315px',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButton: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '5px solid white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeft: '24px solid white',
    borderTop: '14px solid transparent',
    borderBottom: '14px solid transparent',
  },
  videoPlayer: {
    borderRadius: '8px',
  },
};

export default EmbedComponent;
