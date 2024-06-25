import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import CameraIcon from "../icons/camera";
import { supabase } from "../db";
import { getUserId, debug } from "../utils";
import { useLoadingBar } from "../Providers/LoadingBarProvider";
import Image from "../Image";
import { Menu, Item, Separator, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useMyPhotos } from "../Providers/MyPhotosProvider";
import { LYFT_PINK } from "../themes/colors";

const MENU_ID = "image-context-menu";

const PhotoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  /* max-width: 1000px; */
  /* padding: 10px; */
  justify-content: center;
`;

const PhotoWrapper = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-sizing: border-box;
  background: #d3d3d3;

  /// we don't want animation to still calculate after image is loaded...
  animation-duration: 2.2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
  background: #ddd;
  background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
  background-size: 1200px 100%;
  ${(props) => props.primary && `border: 4px solid ${LYFT_PINK};`}

  & img {
    ${(props) =>
      props.primary &&
      `
  box-sizing: border-box;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
 `}
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & svg {
    display: block;
  }
`;

const AddPhotoText = styled.div`
  font-size: 14px;
`;


const DeleteText = styled.span`
  color: red;
`;

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`;

const MainTag = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: ${LYFT_PINK};
  border: 4px solid ${LYFT_PINK};
  color: #fff;
  padding: 3px;
  font-size: 14px;
  border-radius: 14px;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  opacity: 1;
  /* animation: ${fadeIn} 1s forwards; */
`;

const UpdatePhotosScreen = () => {
  const {
    photos,
    photoIsMain,
    uploading,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
  } = useMyPhotos();

  const handlePhotoUpload = async (event) => {
    const photo = event.target.files[0];
    return uploadPhoto(photo);
  };

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const mkHandleContextMenu = (index) =>
    function handleContextMenu(event) {
      show({
        event,
        props: {
          key: "value",
          photoIndex: index,
        },
      });
    };

  // I'm using a single event handler for all items
  // but you don't have too :)

  const handleMakeMain = ({ props }) => {
    const { photoIndex } = props;
    setMainPhoto(photoIndex);
  };
  const handleDelete = async ({ props }) => {
    const { photoIndex } = props;

    const photo = photos[photoIndex];

    if (photoIsMain(photo)) {
      alert("Cannot delete main photo, make another photo your main and try again.");
      return;
    }

    const hasConfirmation = window.confirm(
      "Are you sure you want to delete this photo?"
    );
    if (!hasConfirmation) return;

    deletePhoto(photoIndex);

    // const userId = getUserId();
    // const photo = photos[photoIndex];

    // // Optimistically remove the photo from the screen
    // const newPhotos = photos.filter((_, index) => index !== photoIndex);
    // setPhotos(newPhotos);

    // const { error: deleteError } = await supabase
    //   .from("profile_photos")
    //   .delete()
    //   .eq("user_id", userId)
    //   .eq("id", photo.id);

    // if (deleteError) {
    //   console.error("Error deleting photo: ", deleteError.message);
    //   alert("Failed to delete photo");
    //   // Revert back to the original state if delete fails
    //   setPhotos(photos);
    //   return;
    // }
  };

  return (
    <>
      <Container>
        <MainHeader title="Update Photos" back />
        <Content>
          <PhotoGrid>
            {photos.map((photo, index) => (
              <div key={photo.id} style={{ position: "relative" }}>
                <PhotoWrapper
                  key={index}
                  primary={photoIsMain(photo)}
                  // onClick={() => setMainPhoto(index)}
                  onClick={mkHandleContextMenu(index)}
                >
                  <Image
                    src={photo.photo_med}
                    alt={`Photo ${index + 1}`}
                    // loader={<ImageSkeleton />}
                    // decode={false}
                  />
                </PhotoWrapper>
                {photoIsMain(photo) && <MainTag>main</MainTag>}
                {/* <DeletePhoto>
                  <div>X</div>
                </DeletePhoto> */}
              </div>
            ))}
            <form>
              <PhotoWrapper>
                <AddPhoto as="label">
                  <CameraIcon />
                  <AddPhotoText>
                    {uploading ? "Uploading..." : "Add Photo"}
                  </AddPhotoText>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </AddPhoto>
              </PhotoWrapper>
            </form>
            {/* <PhotoWrapper>spacer</PhotoWrapper> */}
          </PhotoGrid>
        </Content>
        <Menu id={MENU_ID}>
          <Item id="promote" onClick={handleMakeMain}>
            Make Main Profile Photo
          </Item>

          <Separator />
          <Item id="delete" onClick={handleDelete}>
            <DeleteText>Delete Photo</DeleteText>
          </Item>
        </Menu>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default UpdatePhotosScreen;
