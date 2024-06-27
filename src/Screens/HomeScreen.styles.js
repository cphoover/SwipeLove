
import styled from "styled-components";
import TinderCard from "react-tinder-card";

export const HomeHeaderWrapper = styled.div`
  height: 68px;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

export const HomeHeaderLogo = styled.div`
  display: flex;
  align-items: center;
`;

export const HomeHeaderText = styled.span`
  color: #41626d;
  font-size: 20px;
  font-family: "Montserrat";
  letter-spacing: -0.5px;
  line-height: 28px;
  padding-left: 5px;
  font-weight: 500;
`;

export const HomeHeaderButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  & svg {
    fill: #7f7f7f;
    width: 24px;
  }
`;

export const ProfileCard = styled.div`
  width: calc(100% - 40px);
  background-color: #ffffff;
  border-radius: 24px;
  height: 500px;
  padding: 24px;
  box-shadow: 2px 0px 10px rgb(233 232 232);
`;


export const ProfilePhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%; /* Adjust as needed */
  overflow: hidden; /* To hide the overflow part of the image */
  position: relative; /* Necessary for absolute positioning */
  border-radius: 24px;
  & img {
    width: 100%;
    border-radius: 24px;
    display: block;
    height: auto; /* Maintain aspect ratio */
    position: absolute; /* Absolute positioning within the parent */
    top: 50%; /* Move to the vertical center */
    left: 50%; /* Move to the horizontal center */
    transform: translate(-50%, -50%); /* Center the image */
  }
  overflow: hidden;
`;

export const NoMoreProfilePhoto = styled(ProfilePhoto)`
  & div {
    background: #aae5d6;
  }
  & img {
    width: 82%;
  }
`;

export const ProfileName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-family: "Open Sans";
  font-weight: 500;
  line-height: 32px;
  text-align: center;
  padding-top: 20px;
  & svg {
    width: 18px;
  }
`;

export const ProfileAge = styled.div`
  color: #030303;
  font-size: 18px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 28px;
  text-align: center;
  padding-top: 8px;
`;

export const ProfileBio = styled.div`
  color: #030303;
  font-size: 14px;
  font-family: "Open Sans";
  line-height: 20px;
  text-align: center;
`;

export const InteractionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  padding-top: 20px;
`;

export const StyledTinderCard = styled(TinderCard)`
  width: 100%;
  max-width: 400px; /* Adjust as per your design */
  height: 100%;
  max-height: 600px; /* Adjust as per your design */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const SwipeArea = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  height: 570px; // need to find a better way to set this
  & .swipe {
    position: absolute;
  }
`;

export const HiddenAdminButton = styled.div`
  background: white;
  flex: 1;
  height: 100%;
  margin-right: 20px;
`;
