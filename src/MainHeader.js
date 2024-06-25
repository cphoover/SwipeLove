import React from "react";
import { AppHeader } from "./Layout";
import GearIcon from "./icons/gear";
import NotificationsIcon from "./icons/notification";
import styled from "styled-components";
import BackIcon from "./icons/back";
import { useRouter } from "./Router";
import { LYFT_PINK } from "./themes/colors";
// import { useRouter } from "./Router";
// import { useCompletions } from "./Providers/CompletionsProvider";

const IconWrapper = styled.div`
  position: relative;
  & svg {
    fill: #7f7f7f;
  }

  &.active svg {
    fill: ${LYFT_PINK};
  }
`;

const MenuButton = ({ onclick, isActive, children }) => (
  <IconWrapper className={isActive ? "active" : "qwer"} onClick={onclick}>
    {children}
  </IconWrapper>
);

const UnreadCount = styled.div`
  position: absolute;
  top: 0px;
  background: red;
  padding: 4px;
  font-size: 10px;
  border-radius: 50%;
  font-weight: bold;
  color: white;
  right: 0px;
  font-family: "Montserrat";
`;

const MainHeader = ({ title = "barcrawl", back }) => {
  const { isCurrentPage, goto } = useRouter();
  // const { unreadCountValue } = useCompletions();

  return (
    <AppHeader
      title={title}
      leftIcon={
        <MenuButton
          // isActive={isCurrentPage("settings")}
          onclick={() => {
            back ? global.history.back() : goto("home");
          }}
        >
          <BackIcon />
        </MenuButton>
      }
      rightIcon={
        <MenuButton
          isActive={isCurrentPage("notifications")}
          onclick={() => {
            goto("notifications");
          }}
        >
          <NotificationsIcon />
          {/* {unreadCountValue > 0 && (
            <UnreadCount>{unreadCountValue}</UnreadCount>
          )} */}
        </MenuButton>
      }
    />
  );
};

export default MainHeader;
