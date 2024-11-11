import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import PersonAvatar from "../PersonAvatar";
import RightArrowIcon from "../icons/right-arrow";

const NotificationsList = styled.ul`
  list-style-type: none;
  padding: 0;
  /* margin-top: 32px; */
`;

const NotificationListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 16px;
  /* height: 109px; */
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 2px 0px 10px rgba(3, 3, 3, 0.1);
  margin-bottom: 16px;
`;

const NotificationDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`;
const NotificationMsg = styled.div`
  font-size: 18px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 28px;
`;

const NotificationText = styled.div`
  font-size: 14px;
  font-family: "Open Sans";
  font-weight: 300;
  line-height: 20px;
`;

const GoButton = styled.div`
  margin-left: auto;
`;
const NotificationsScreen = () => {
  return (
    <>
      <Container>
        <MainHeader title="Notifications" />
        <Content>
          <NotificationsList>
            <NotificationListItem>
              <PersonAvatar
                small
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person1.png`}
              />
              <NotificationDetails>
                <NotificationMsg>Sarah matched with you</NotificationMsg>
                <NotificationText>Start chatting now!</NotificationText>
              </NotificationDetails>
              <GoButton>
                <RightArrowIcon />
              </GoButton>
            </NotificationListItem>
            <NotificationListItem>
              <PersonAvatar
                small
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person4.jpeg`}
              />
              <NotificationDetails>
                <NotificationMsg>Alex messaged you!</NotificationMsg>
                <NotificationText>Let's grab coffee sometime?</NotificationText>
              </NotificationDetails>
              <GoButton>
                <RightArrowIcon />
              </GoButton>
            </NotificationListItem>
            <NotificationListItem>
              <PersonAvatar
                small
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person3.jpeg`}
              />
              <NotificationDetails>
                <NotificationMsg>Jen matched with you</NotificationMsg>
                <NotificationText>Want to grab dinner?</NotificationText>
              </NotificationDetails>
              <GoButton>
                <RightArrowIcon />
              </GoButton>
            </NotificationListItem>
            <NotificationListItem>
              <PersonAvatar
                small
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person2.jpeg`}
              />
              <NotificationDetails>
                <NotificationMsg>April Matched with you</NotificationMsg>
                <NotificationText>Start chatting now!</NotificationText>
              </NotificationDetails>
              <GoButton>
                <RightArrowIcon />
              </GoButton>
            </NotificationListItem>
          </NotificationsList>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default NotificationsScreen;
