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
import { useRouter } from "./Router";
import { LYFT_PINK } from "./themes/colors";

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
    fill: rgb(211, 211, 211);
  }

  &.active {
    color: black;
    svg {
      fill: ${LYFT_PINK};
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
  const { isCurrentPage, goto } = useRouter();

  return (
    <TabBarContainer>
      <TabItem
        className={isCurrentPage("home") ? "active" : ""}
        onClick={() => {
          goto("home");
        }}
      >
        <IconContainer>
          <HomeButton />
        </IconContainer>
        {/* <TabLabel>Map</TabLabel> */}
      </TabItem>
      <TabItem
        className={isCurrentPage("settings") ? "active" : ""}
        onClick={() => {
          goto("settings");
        }}
      >
        <IconContainer>
          <SettingsButton />
        </IconContainer>
        {/* <TabLabel>Players</TabLabel> */}
      </TabItem>
      <TabItem
        className={
          isCurrentPage("chats") || isCurrentPage("conversation")
            ? "active"
            : ""
        }
        onClick={() => {
          goto("chats");
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
