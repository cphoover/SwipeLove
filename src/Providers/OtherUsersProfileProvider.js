import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../db";
import { useLoadingBar } from "../Providers/LoadingBarProvider";

const UserProfileContext = createContext();

export const OtherUsersProfileProvider = ({ userId, children }) => {
  const [profileData, setProfileData] = useState(null);
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState([]);
  const { initializeLoadingBar, finishLoadingBar } = useLoadingBar();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      initializeLoadingBar("fetchingProfileData");

      try {
        const { data: userProfile, error: userProfileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (userProfileError) throw userProfileError;

        const { data: mainPhoto, error: mainPhotoError } = await supabase
          .from("main_photos")
          .select("photo_id")
          .eq("user_id", userId)
          .single();

        if (mainPhotoError) throw mainPhotoError;

        const { data: mainPhotoUrl, error: mainPhotoUrlError } = await supabase
          .from("profile_photos")
          .select("photo_url")
          .eq("id", mainPhoto.photo_id)
          .single();

        if (mainPhotoUrlError) throw mainPhotoUrlError;

        const { data: otherPhotos, error: otherPhotosError } = await supabase
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
      setProfileDataLoaded(true);
      finishLoadingBar("fetchingProfileData");
    };

    fetchProfileData();
  }, [userId]);

  return (
    <UserProfileContext.Provider
      value={{
        profileData,
        profilePhotos,
        profileDataLoaded
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useOtherUsersProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error(
      "useOtherUsersProfile must be used within a UserProfileProvider"
    );
  }
  return context;
};
