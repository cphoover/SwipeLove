import React from "react";
import { Container, Content } from "../Layout";
import BottomTabMenu from "../BottomTabMenu";
import styled from "styled-components";
import BackIcon from "../icons/back";
import RejectButton from "../RejectButton";
import LikeButton from "../LikeButton";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useRouter } from "../Router";

const ProfilePhoto = styled.div`
  top: 0px;
  left: 0px;
  width: 100%;
  height: 380px;
  overflow: hidden;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 20px;
  left: 20px;
  width: 44px;
  position: absolute;
  height: 44px;
  border: 0;
  box-sizing: border-box;
  border-radius: 32px;
  color: #ffffff;
  background-color: #030303;
  outline: none;
  z-index: 2;

  & svg {
    fill: white;
    width: 12px;
  }
`;

const InteractionContainer = styled.div`
  display: flex;
  margin-top: 20px;
  position: absolute;
  bottom: -30px;
  gap: 40px;
  width: 100%;
  justify-content: center;
`;

const TopWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ProfileName = styled.h1`
  color: #272727;
  font-size: 24px;
  font-family: "Montserrat";
  font-weight: 700;
  line-height: 31px;
  display: block;
  padding-top: 60px;
  display: block;
`;

const ProfileText = styled.div`
  color: #8d8d8d;
  font-size: 14px;
  font-family: "Montserrat";
  line-height: 18px;
`;

const ProfileLabel = styled.div`
  color: #272727;
  font-size: 14px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 20px;
  margin-bottom: 8px;
`;

const ProfileSection = styled.div`
  margin-top: 24px;
`;

/** Interests List Composed of Interest Pills */
const InterestsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
`;

const InterestPill = styled.li`
  display: inline-block;
  background-color: #f5f5f5;
  color: #272727;
  font-size: 12px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 16px;
  padding: 8px 16px;
  border-radius: 24px;
  margin-right: 8px;
  margin-bottom: 8px;

  cursor: pointer;
  height: 36px;

  border: 0;
  box-sizing: border-box;
  border-radius: 24px;
  background-color: #d3d3d3;
  color: #030303;
  font-size: 13px;
  font-family: "Montserrat";
  line-height: 18px;
  outline: none;
`;

const JustifiedText = styled.div`
  display: flex;
  justify-content: space-between;
`;

const profilePhotos = [
  "/images/profile-photos/person1.png",
  "/images/profile-photos/person2.jpeg",
  "/images/profile-photos/person3.jpeg",
  "/images/profile-photos/person4.jpeg",
  "/images/profile-photos/person5.jpeg",
  "/images/profile-photos/person6.jpeg",
  "/images/profile-photos/person7.jpeg",
];
const ProfileScreen = () => {
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const { goto }= useRouter();
  return (
    <>
      <Container>
        <Lightbox
          open={isViewerOpen}
          close={() => setIsViewerOpen(false)}
          slides={profilePhotos.map((photo) => ({ src: photo }))}
          plugins={[Zoom]}
        />
        <TopWrapper>
          <ProfilePhoto>
            <img
              onClick={() => setIsViewerOpen(true)}
              src="/images/profile-photos/person1.png"
              alt="Profile"
            />
          </ProfilePhoto>
          <BackButton
            
          >
            <BackIcon />
          </BackButton>
          <InteractionContainer>
            <RejectButton />
            <LikeButton />
          </InteractionContainer>
        </TopWrapper>
        {/* <MainHeader title="Chats" /> */}
        <Content>
          <ProfileName>Emily Davis</ProfileName>
          <JustifiedText>
            <ProfileText>31 year old Kindergarten Teacher</ProfileText>
            <ProfileText>5 miles away</ProfileText>
          </JustifiedText>

          <ProfileSection>
            <ProfileLabel>About Me</ProfileLabel>
            <ProfileText>
              I love to travel and explore new places. I enjoy hiking and
              spending time with my friends and family.
            </ProfileText>
          </ProfileSection>

          <ProfileSection>
            <ProfileLabel>Interests</ProfileLabel>
            <InterestsList>
              <InterestPill>Travel</InterestPill>
              <InterestPill>Food</InterestPill>
              <InterestPill>Outdoors</InterestPill>
              <InterestPill>Family</InterestPill>
              <InterestPill>Friends</InterestPill>
              <InterestPill>Music</InterestPill>
              <InterestPill>Reading</InterestPill>
            </InterestsList>
          </ProfileSection>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default ProfileScreen;
