import styled from "styled-components";
import { LYFT_PINK } from "./themes/colors";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 60px;
`;
export const HeaderSpacer = styled.div`
  height: 70px;
  width: 100%;
`;
export const Header = styled.header`
  position: fixed;
  width: 100%;
  height: 68px;
  background-color: #ffffff;
  background-color: #ffffff;
  box-shadow: 2px -2px 10px rgba(3, 3, 3, 0.1);

  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2; // Ensure header is above other content
  & svg {
    display: block;
    fill: black;
  }
`;

export const Title = styled.h1`
  color: #030303;
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  line-height: 24px;
`;

// Styled components for left and right icons/buttons
export const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  // add 10px horizontal padding to the icon
  padding: 0 20px;
`;

// Your main header component where you incorporate these styled components
export const AppHeader = ({ title, leftIcon, rightIcon }) => {
  return (
    <>
      <Header>
        <MenuIcon>{leftIcon}</MenuIcon>
        <Title>{title}</Title>
        <MenuIcon>{rightIcon}</MenuIcon>
      </Header>
      <HeaderSpacer />
    </>
  );
};

export const Content = styled.div`
  padding: 20px; /* This ensures padding around the content */
  width: 100%; /* Adjust width to account for padding */
  box-sizing: border-box; /* Ensures padding is included in width calculation */
`;

export const Label = styled.label`
  color: #030303;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  line-height: 19px;
  margin-top: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin-top: 8px;
  border: 1px solid #dddddd;
  border-radius: 24px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: #222222;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  line-height: 19px;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 25px;
`;

export const SectionTitle = styled.h2`
  color: #030303;
  font-size: 24px;
  font-family: "Montserrat";
  font-weight: 600;
  line-height: 28px;
`;

export const Button = styled.button`
  width: fit-content;
  display: block;
  padding: 0 15px;
  height: 36px;
  border: 1px solid ${LYFT_PINK};
  border-radius: 24px;
  /* existing styles */
  background-color: ${(props) => (props.disabled ? "#ddd" : LYFT_PINK)};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  color: ${(props) => (props.disabled ? "#666666" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 14px;
  font-family: "Open Sans";
  line-height: 16px;
  outline: none;
`;

export const Terms = styled.div`
  color: #030303;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
  margin-top: 20px;
`;
