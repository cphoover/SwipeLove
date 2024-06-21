import React from "react";
import styled from "styled-components";
import MapIcon from "./icons/map";
import CameraIcon from "./icons/camera";
import TrophyIcon from "./icons/trophy";
// import { useRouter } from "./Router";
import PlayerIcon from "./icons/player";
import HomeButton from "./HomeButton";
import NotificationsButton from "./NotificationsButton";
import SettingsButton from "./Screens/SettingsButton";
import ChatButton from "./ChatButton";

const TabBarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  box-sizing: border-box;
`;

const TabItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: #7f7f7f;
  & svg {
    fill: #7f7f7f;
  }

  &.active {
    color: black;
    svg {
      fill: black;
    }
  }
`;

const IconContainer = styled.div`
  margin-bottom: 5px;
`;

const TabLabel = styled.span`
  font-size: 12px;
`;

function BottomTabMenu() {
  // const { isCurrentPage, goto } = useRouter();
  const isCurrentPage = () => false;
  const goto = () => {};
  return (
    <TabBarContainer>
      <TabItem
        className={isCurrentPage("map") ? "active" : ""}
        onClick={() => {
          goto("map");
        }}
      >
        <IconContainer>
          <HomeButton />
        </IconContainer>
        {/* <TabLabel>Map</TabLabel> */}
      </TabItem>
      <TabItem
        className={isCurrentPage("leaderboard") ? "active" : ""}
        onClick={() => {
          goto("leaderboard");
        }}
      >
        <IconContainer>
          <SettingsButton />
        </IconContainer>
        {/* <TabLabel>Players</TabLabel> */}
      </TabItem>
      <TabItem
        className={isCurrentPage("photos") ? "active" : ""}
        onClick={() => {
          goto("photos");
        }}
      >
        <IconContainer>
         <ChatButton />
        </IconContainer>
        {/* <TabLabel>Photos</TabLabel> */}
      </TabItem>
    </TabBarContainer>
  );
}

export default BottomTabMenu;
