import React from 'react';

const styles = {
  Icon: {
    color: '#000000',
    // fill: '#000000',
    fontSize: '18px',
    top: '725px',
    left: '78px',
    width: '18px',
    height: '26px',
  },
};

const HomeIcon = () => (
  <svg style={styles.Icon}  viewBox="0 0 512 512">
    <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z">
    </path>
  </svg>
);

const defaultProps = {
  IconComponent: HomeIcon,
};

const HomeButton = (props) => {
  return (
    props.IconComponent 
      ? <props.IconComponent style={styles.Icon} /> 
      : <defaultProps.IconComponent />
  );
};

export default HomeButton;