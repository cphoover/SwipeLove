import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import PersonAvatar from "../PersonAvatar";
import RightArrowIcon from "../icons/right-arrow";
import {
  GithubCounter,
  GithubSelector,
  PokemonSelector,
  ReactionBarSelector,
  ReactionBarSelectorEmoji,
  ReactionCounter,
  SlackCounter,
  SlackSelector,
} from "@charkour/react-reactions";

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1000px; /* Adjust based on your preference */
  padding: 10px;
`;

/*
        .photo-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .photo-grid img {
            flex: 1 1 100px;
            max-width: 500px;
            width: 100%;
            height: auto;
        }
        */
const PhotoWrapper = styled.div`
  padding-top: 100%; /* Makes it a square */
  position: relative;
  & img {
    ${(props) =>
      props.primary &&
      `border: 4px solid #2ecc71;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
 `}
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const AddPhoto = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d3d3d3;
  color: #030303;
  font-size: 24px;
  font-family: "Open Sans";
  font-weight: 600;

`;

const UpdatePhotosScreen = () => {
  return (
    <>
      <Container>
        <MainHeader title="Update Photos" />
        <Content>
          <PhotoGrid>
            <PhotoWrapper primary>
              <img src="/images/profile-photos/person2.jpeg" alt="Photo 1" />
            </PhotoWrapper>
            <PhotoWrapper>
              <img src="/images/profile-photos/person3.jpeg" alt="Photo 2" />
            </PhotoWrapper>
            <PhotoWrapper>
              <img src="/images/profile-photos/person4.jpeg" alt="Photo 3" />
            </PhotoWrapper>
            <PhotoWrapper>
              <img src="/images/profile-photos/person5.jpeg" alt="Photo 4" />
            </PhotoWrapper>
            <PhotoWrapper>
              <img src="/images/profile-photos/person6.jpeg" alt="Photo 5" />
            </PhotoWrapper>
            <PhotoWrapper>
              <img src="/images/profile-photos/person7.jpeg" alt="Photo 6" />
            </PhotoWrapper>
            <PhotoWrapper>
              <AddPhoto>+</AddPhoto>
            </PhotoWrapper>
          </PhotoGrid>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default UpdatePhotosScreen;
