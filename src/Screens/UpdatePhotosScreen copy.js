import React from "react";
import styled from "styled-components";
import { Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import CameraIcon from "../icons/camera";
import { LYFT_PINK } from "../themes/colors";

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1000px; /* Adjust based on your preference */
  padding: 10px;
`;

const PhotoWrapper = styled.div`
  padding-top: 100%; /* Makes it a square */
  max-width: 180px;
  /* max-height: 200px; */
  position: relative;
  & img {
    ${(props) =>
      props.primary &&
      `border: 4px solid ${LYFT_PINK};
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
        <MainHeader title="Update Photos" back />
        <Content>
          <PhotoGrid>
            {/* <PhotoWrapper primary>
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
            </PhotoWrapper> */}
            {/* <PhotoWrapper>
              <img src="/images/profile-photos/person7.jpeg" alt="Photo 6" />
            </PhotoWrapper> */}
            <PhotoWrapper>
              <AddPhoto>
                <CameraIcon />
              </AddPhoto>
            </PhotoWrapper>
            <PhotoWrapper>
              {/** spacer */}
            </PhotoWrapper>
          </PhotoGrid>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default UpdatePhotosScreen;
