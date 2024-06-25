import React from 'react';

const styles = {
  Icon: {
    color: '#d3d3d3',
    // fill: '#d3d3d3',
    fontSize: '20px',
    top: '725px',
    left: '277px',
    width: '20px',
    height: '26px',
  },
};

const ChatIcon = () => (
  <svg style={styles.Icon}  viewBox="0 0 512 512">
    <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z">
    </path>
  </svg>
);

const defaultProps = {
  IconComponent: ChatIcon,
};

const ChatButton = (props) => {
  return (
    props.IconComponent 
      ? <props.IconComponent style={styles.Icon} /> 
      : <defaultProps.IconComponent />
  );
};

export default ChatButton;