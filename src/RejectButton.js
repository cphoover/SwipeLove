import React from "react";

const styles = {
  Button: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "612px",
    left: "107px",
    width: "60px",
    height: "60px",
    border: "0",
    boxSizing: "border-box",
    borderRadius: "9999px",
    color: "#ffffff",
    backgroundColor: "#e74c3c",
    outline: "none",
  },
  Icon: {
    color: "#ffffff",
    fill: "#ffffff",
    width: "30px",
    height: "30px",
    fontSize: "30px",
  },
};

const RejectIcon = () => (
  <svg style={styles.Icon} viewBox="0 0 352 512">
    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
  </svg>
);

const defaultProps = {
  IconComponent: RejectIcon,
};

const RejectButton = ({ onClick, ...props }) => {
  return (
    <button onClick={onClick} style={styles.Button}>
      {props.IconComponent ? (
        <props.IconComponent style={styles.Icon} />
      ) : (
        <defaultProps.IconComponent />
      )}
    </button>
  );
};

export default RejectButton;
