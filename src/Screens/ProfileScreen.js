import React, { useEffect, useMemo, useState } from "react";
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
import { supabase } from "../db";
import { calculateAge } from "../utils";
import { useLoadingBar } from "../Providers/LoadingBarProvider";

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
  /* padding-top: 60px; */
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

const ProfileScreen = () => {
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const { initializeLoadingBar, finishLoadingBar } = useLoadingBar();
  const [profileData, setProfileData] = useState(null);
  const [profilePhotos, setProfilePhotos] = useState([]);
  const { queryParams, goto } = useRouter();
  const userId = queryParams.get("user_id");

  const randomDistance = useMemo(() => Math.floor(Math.random() * 20) + 1, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      initializeLoadingBar("fetchingProfileData-profileScreen");
      try {
        // Fetch user profile data
        let { data: userProfile, error: userProfileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (userProfileError) throw userProfileError;

        // Fetch main photo
        let { data: mainPhoto, error: mainPhotoError } = await supabase
          .from("main_photos")
          .select("photo_id")
          .eq("user_id", userId)
          .single();

        if (mainPhotoError) throw mainPhotoError;

        let { data: mainPhotoUrl, error: mainPhotoUrlError } = await supabase
          .from("profile_photos")
          .select("photo_url")
          .eq("id", mainPhoto.photo_id)
          .single();

        if (mainPhotoUrlError) throw mainPhotoUrlError;

        // Fetch other profile photos
        let { data: otherPhotos, error: otherPhotosError } = await supabase
          .from("profile_photos")
          .select("photo_url")
          .eq("user_id", userId)
          .neq("id", mainPhoto.photo_id);

        if (otherPhotosError) throw otherPhotosError;

        setProfileData({ ...userProfile, mainPhoto: mainPhotoUrl.photo_url });
        setProfilePhotos([
          mainPhotoUrl.photo_url,
          ...otherPhotos.map((photo) => photo.photo_url),
        ]);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
      finishLoadingBar("fetchingProfileData-profileScreen");
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  if (!profileData) {
    return <></>;
  }

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
              src={profileData.mainPhoto}
              alt="Profile"
            />
          </ProfilePhoto>
          <BackButton
            onClick={() => {
              goto("home");
            }}
          >
            <BackIcon />
          </BackButton>
          {/* We will comment this out for now... we want matches to be in a provider */}
          {/* <InteractionContainer>
            <RejectButton />
            <LikeButton />
          </InteractionContainer> */}
        </TopWrapper>
        <Content>
          <ProfileName>
            {profileData.first_name} {profileData.last_name}
          </ProfileName>
          <JustifiedText>
            <ProfileText>
              {calculateAge(profileData.birthdate)} year old{" "}
              {profileData.occupation}
            </ProfileText>
            <ProfileText>
              {/* random distance between 1 and 20 miles for now */}
              {["sofia", "alex"].includes(profileData?.first_name?.toLowerCase())
                ? "Less than a mile away"
                : `${randomDistance} miles away`}
            </ProfileText>
          </JustifiedText>

          <ProfileSection>
            <ProfileLabel>About Me</ProfileLabel>
            <ProfileText>{profileData.bio}</ProfileText>
          </ProfileSection>

          <ProfileSection>
            <ProfileLabel>Interests</ProfileLabel>
            <InterestsList>
              {profileData.interests.split(",").map((interest, index) => (
                <InterestPill key={index}>{interest}</InterestPill>
              ))}
            </InterestsList>
          </ProfileSection>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default ProfileScreen;
