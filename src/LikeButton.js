import React from 'react';

const styles = {
  Button: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '612px',
    left: '207px',
    width: '60px',
    height: '60px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '9999px',
    color: '#ffffff',
    backgroundColor: '#2ecc71',
    outline: 'none',
  },
  Icon: {
    color: '#ffffff',
    fill: '#ffffff',
    width: '30px',
    height: '30px',
    fontSize: '30px',
  },
};

const IconComponent = () => (
  <svg style={styles.Icon}  viewBox="0 0 512 512">
    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z">
    </path>
  </svg>
);

const defaultProps = {
  IconComponent,
};

const LikeButton = ({onClick, ...props}) => {
  return (
    <button onClick={onClick} style={styles.Button}>
      {
        props.IconComponent 
          ? <props.IconComponent style={styles.Icon} /> 
          : <defaultProps.IconComponent />
      }
    </button>
  );
};

export default LikeButton;