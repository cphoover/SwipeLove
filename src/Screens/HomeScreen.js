import React from "react";
import styled from "styled-components";
import { Container, Content } from "../Layout";
// // import PersonMarker from "../PersonAvatar";
// import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import TinderCard from "react-tinder-card";
// // import Legal from "../Legal";
// // import { useOtherUsers } from "../Providers/OtherUsersProvider";
// // import { useMyUser } from "../Providers/MyUserProvider";
// // import { useCompletions } from "../Providers/CompletionsProvider";
// import { debug } from "../utils";
// // import { SectionTitle } from "../Layout";
import HeartIcon from "../icons/heart";
import GearIcon from "../icons/gear";
import RejectButton from "../RejectButton";
import LikeButton from "../LikeButton";

import Match from "../Match";
// import HomeHeader from "../HomeHeader";

const CardList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CardLine = styled.li`
  & svg {
    vertical-align: middle;
    margin-right: 8px;
    position: relative;
    top: -2px;
  }
  color: #121212;
  font-size: 12px;
  font-family: "Montserrat";
  font-weight: 500;
  // height: 48px;

  background-color: #ffffff;
  padding: 16px;
  margin-bottom: 13px;
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

const ScoreWrapper = styled.div`
  display: flex;
`;

const PhotoWrapper = styled.div`
  width: fit-content;
  margin-right: 20px;
`;

const ScoreDetails = styled.div`
  flex: 1;
`;

const PersonName = styled.div`
  // color: #030303;
  font-size: 20px;
  font-family: "Montserrat";
  font-weight: 600;
  line-height: 24px;
`;

const Score = styled.div`
  // color: #030303;
  font-size: 18px;
  font-family: "Montserrat";
  font-weight: 400;
  line-height: 21px;
  margin-top: 4px;
`;

const HomeHeaderWrapper = styled.div`
  height: 68px;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const HomeHeaderLogo = styled.div`
  display: flex;
  align-items: center;
`;

const HomeHeaderText = styled.span`
  color: #41626d;
  font-size: 20px;
  font-family: "Montserrat";
  letter-spacing: -0.5px;
  line-height: 28px;
  padding-left: 5px;
`;

const HomeHeaderButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  & svg {
    fill: black;
    width: 24px;
  }
`;

const ProfileCard = styled.div`
  background-color: #ffffff;
  border-radius: 24px;
  height: 500px;
  padding: 24px;
  box-shadow: 2px 0px 10px rgb(233 232 232);
`;

const ProfilePhoto = styled.div`
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

const ProfileName = styled.div`
  font-size: 24px;
  font-family: "Open Sans";
  font-weight: 500;
  line-height: 32px;
  text-align: center;
  padding-top: 20px;
`;

const ProfileAge = styled.div`
  color: #030303;
  font-size: 18px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 28px;
  text-align: center;
  padding-top: 8px;
`;

const ProfileBio = styled.div`
  color: #030303;
  font-size: 14px;
  font-family: "Open Sans";
  line-height: 20px;
  text-align: center;
`;

const InteractionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  padding-top: 24px;
`;

const SwipeArea = styled.div`
  position: relative;
  height: 600px; // need to find a better way to set this
  & .swipe {
    position: absolute;
  }
`;
const datingProfiles = [
  {
    profilePhoto: "/images/profile-photos/person1.png",
    fullName: "Alexandra Johnson",
    age: 28,
    bio: "Love hiking, photography, and trying out new coffee shops. Let’s explore together!",
  },
  {
    profilePhoto: "/images/profile-photos/person2.jpeg",
    fullName: "Brittany Smith",
    age: 24,
    bio: "Avid reader and aspiring writer. Looking for someone to share book recommendations and deep conversations.",
  },
  {
    profilePhoto: "/images/profile-photos/person3.jpeg",
    fullName: "Charlotte Davis",
    age: 30,
    bio: "Foodie and traveler. Always on the lookout for the next culinary adventure. Let’s find the best eats together!",
  },
  {
    profilePhoto: "/images/profile-photos/person4.jpeg",
    fullName: "Dana Lee",
    age: 26,
    bio: "Fitness enthusiast and dog lover. I enjoy morning runs and weekend hikes with my furry friend.",
  },
  {
    profilePhoto: "/images/profile-photos/person5.jpeg",
    fullName: "Evelyn Taylor",
    age: 27,
    bio: "Tech geek and gamer. I can spend hours talking about the latest gadgets or the best strategies for my favorite games.",
  },
  {
    profilePhoto: "/images/profile-photos/person6.jpeg",
    fullName: "Faith Martinez",
    age: 25,
    bio: "Music lover and artist. I play the guitar and love going to live concerts. Let’s jam together!",
  },
  {
    profilePhoto: "/images/profile-photos/person7.jpeg",
    fullName: "Grace Brown",
    age: 29,
    bio: "Entrepreneur and coffee addict. I’m passionate about startups and innovation. Let’s brainstorm over a cup of coffee!",
  },
];


const HomeScreen = () => {
  // return false;
  return (
    <>
      <Container>
        <HomeHeaderWrapper>
          <HomeHeaderLogo>
            <HeartIcon />
            <HomeHeaderText>QuickFlings</HomeHeaderText>
          </HomeHeaderLogo>
          <HomeHeaderButton>
            <GearIcon />
          </HomeHeaderButton>
        </HomeHeaderWrapper>
        <Content>
          <SwipeArea>
            {/* <TinderCard className="swipe">
              <ProfileCard>
                <ProfilePhoto>
                  <img src="/images/woman.png" alt="Profile photo" />
                </ProfilePhoto>
                <ProfileName>Alex Johnson</ProfileName>
                <ProfileAge>28 years old</ProfileAge>
                <ProfileBio>
                  Loves hiking, photography, and exploring new cuisines. Looking
                  for someone to share adventures with.
                </ProfileBio>
              </ProfileCard>
            </TinderCard> */}
            {datingProfiles.map((profile, index) => (
              <TinderCard className="swipe" key={index}>
                <ProfileCard>
                  <ProfilePhoto>
                    <img src={profile.profilePhoto} alt="Profile photo" />
                  </ProfilePhoto>
                  <ProfileName>{profile.fullName}</ProfileName>
                  <ProfileAge>{profile.age} years old</ProfileAge>
                  <ProfileBio>{profile.bio}</ProfileBio>
                </ProfileCard>
              </TinderCard>
            ))}
          </SwipeArea>
          <InteractionContainer>
            <RejectButton />
            <LikeButton />
          </InteractionContainer>
        </Content>
      </Container>
      <BottomTabMenu />
      {/* <Match /> */}
    
    </>
  );
};

export default HomeScreen;
