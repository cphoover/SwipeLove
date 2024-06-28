import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import PersonAvatar from "../PersonAvatar";
import { useRouter } from "../Router";

const NotificationsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const NotificationLine = styled.li`
  & svg {
    vertical-align: middle;
    margin-right: 10px;
    position: relative;
    top: -2px;
  }
  color: #121212;
  font-size: 14px;
  font-family: "Montserrat";
  font-weight: 500;
  // height: 48px;

  background-color: #ffffff;
  padding: 16px;
  margin-bottom: 14px;
  border-radius: 24px;
  box-shadow: 0px 2px 10px rgba(3, 3, 3, 0.1);
  &.active {
    background-color: black;
    color: white;
    box-shadow: none;
    & svg {
      fill: white;
    }
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0px 8px;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: #94a3b8;
  font-size: 16px;
  font-family: "Open Sans";
  line-height: 38px;
  outline: none;
`;

const ChatsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 32px;
`;

const ChatListItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
`;

const ChatDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`;
const ChatName = styled.div`
  font-size: 18px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 28px;
`;

const ChatText = styled.div`
  font-size: 14px;
  font-family: "Open Sans";
  font-weight: 300;
  line-height: 20px;
`;

const ChatsScreen = () => {
  const { goto } = useRouter();
  return (
    <>
      <Container>
        <MainHeader title="Chats" />
        <Content>
          <SearchInput type="search" placeholder="Search..." />
          <ChatsList>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person1.png`} />
              <ChatDetails>
                <ChatName>Jane Doe</ChatName>
                <ChatText>Hey, how are you?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person4.jpeg`} />
              <ChatDetails>
                <ChatName>Heather Braxton</ChatName>
                <ChatText>Hey, how are you?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person3.jpeg`} />
              <ChatDetails>
                <ChatName>April Smith</ChatName>
                <ChatText>Can I get your numbah?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person2.jpeg`} />
              <ChatDetails>
                <ChatName>Kami Kline</ChatName>
                <ChatText>so... how was your day today?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person5.jpeg`} />
              <ChatDetails>
                <ChatName>Silvia Ortega</ChatName>
                <ChatText>Are you going to that concert this weekend?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person6.jpeg`} />
              <ChatDetails>
                <ChatName>Margeret Greene</ChatName>
                <ChatText>I absolutely love your Barcelona photos!</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person7.jpeg`} />
              <ChatDetails>
                <ChatName>Kami Kline</ChatName>
                <ChatText>so... how was your day today?</ChatText>
              </ChatDetails>
            </ChatListItem>
          </ChatsList>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default ChatsScreen;
