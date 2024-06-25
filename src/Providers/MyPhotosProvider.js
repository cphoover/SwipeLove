import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../db";
import { getUserId, debug } from "../utils";
import { useLoadingBar } from "../Providers/LoadingBarProvider";

const MyPhotosContext = createContext();

export const MyPhotosProvider = ({ children }) => {
  const { initializeLoadingBar, finishLoadingBar } = useLoadingBar();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainPhotoId, setMainPhotoId] = useState(null);


  useEffect(() => {
    const fetchPhotos = async () => {
      initializeLoadingBar("fetchPhotos");
      const userId = getUserId();
      const { data, error } = await supabase
        .from("profile_photos")
        .select(
          `
          *,
          main_photos (photo_id)
        `
        )
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching photos: ", error.message);
      } else {
        setPhotos(data);

        const mainPhoto = data.find(
          (item) =>
            item.main_photos && item.main_photos?.[0]?.photo_id === item.id
        );
        setMainPhotoId(mainPhoto ? mainPhoto.id : null);
      }
      finishLoadingBar("fetchPhotos");
    };

    fetchPhotos();
  }, []);

  const photoIsMain = (photo) => photo.id && photo.id === mainPhotoId;
  const mainPhoto = photos.find((photo) => photoIsMain(photo));

  const uploadPhoto = async (photo) => {
    const userId = getUserId();

    if (!photo) return;

    initializeLoadingBar("photoUpload");
    setUploading(true);

    try {
      const fileExt = photo.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile_photos/${fileName}`;

      let { error: uploadError, data: uploadData } = await supabase.storage
        .from("profile_photos")
        .upload(filePath, photo);

      if (uploadError) {
        debug("Error uploading file: ", uploadError);
        alert("Upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const [res1, res2, res3] = await Promise.all([
        supabase.storage.from("profile_photos").getPublicUrl(uploadData.path),
        supabase.storage.from("profile_photos").getPublicUrl(uploadData.path, {
          transform: { width: 400, height: 400 },
        }),
        supabase.storage.from("profile_photos").getPublicUrl(uploadData.path, {
          transform: { width: 100, height: 100 },
        }),
      ]);

      const { data: originalUrl, error } = res1;
      const { data: mediumUrl, error: error2 } = res2;
      const { data: smallUrl, error: error3 } = res3;

      if (error || error2 || error3) {
        console.error("Error getting public URL: ", { error, error2, error3 });
        alert("Failed to get public URL");
        setUploading(false);
        return;
      }

      debug("publicUrls", { originalUrl, mediumUrl, smallUrl });

      const payload = {
        user_id: userId,
        photo_url: originalUrl.publicUrl,
        photo_med: mediumUrl.publicUrl,
        photo_small: smallUrl.publicUrl,
      };

      const res = await supabase
        .from("profile_photos")
        .insert([payload])
        .select("*");
    
     const newPhoto = res?.data?.[0];

      const { error: insertError } = res;

      if (insertError) {
        console.error("Error inserting photo data: ", insertError);
        alert("Failed to save photo data");
        setUploading(false);
        return;
      }

      setPhotos((prev) => [...prev, newPhoto]);
      setUploading(false);
    } catch (error) {
      console.error("Unexpected error: ", error);
      alert("An unexpected error occurred");
      setUploading(false);
    } finally {
      finishLoadingBar("photoUpload");
    }
  };

  //   const setMainPhoto = async (index) => {
  //     const userId = getUserId();
  //     const newPhotos = photos.map((photo, idx) => ({
  //       ...photo,
  //       is_main: idx === index,
  //     }));

  //     try {
  //       const { error } = await supabase
  //         .from("profile_photos")
  //         .update({ is_main: false })
  //         .eq("user_id", userId);

  //       if (error) throw error;

  //       const { error: mainError } = await supabase
  //         .from("profile_photos")
  //         .update({ is_main: true })
  //         .eq("user_id", userId)
  //         .eq("photo_url", newPhotos[index].photo_url);

  //       if (mainError) throw mainError;

  //       setPhotos(newPhotos);
  //     } catch (error) {
  //       console.error("Error setting main photo: ", error);
  //       alert("Failed to set main photo");
  //     }
  //   };

  const setMainPhoto = async (index) => {
    const userId = getUserId();
    const photoId = photos[index].id;
    const previousMainPhotoId = mainPhotoId;

    // Optimistically update the main photo state
    setMainPhotoId(photoId);

    initializeLoadingBar("setMainPhoto");
    try {
      const { error } = await supabase
        .from("main_photos")
        .upsert({ user_id: userId, photo_id: photoId });

      if (error) throw error;
    } catch (error) {
      console.error("Error setting main photo: ", error);
      alert("Failed to set main photo");
      // Revert the main photo state on failure
      setMainPhotoId(previousMainPhotoId);
    }

    finishLoadingBar("setMainPhoto");
  };

  const deletePhoto = async (photoIndex) => {
    const userId = getUserId();
    const photo = photos[photoIndex];

    const newPhotos = photos.filter((_, index) => index !== photoIndex);
    setPhotos(newPhotos);

    // @todo should use photo src as part of key...
    initializeLoadingBar(`deletePhoto-${photo.id}`);
    const { error: deleteError } = await supabase
      .from("profile_photos")
      .delete()
      .eq("user_id", userId)
      .eq("id", photo.id);

    if (deleteError) {
      console.error("Error deleting photo: ", deleteError.message);
      alert("Failed to delete photo");
      setPhotos(photos);
    }
    finishLoadingBar(`deletePhoto-${photo.id}`);
  };

  return (
    <MyPhotosContext.Provider
      value={{
        photos,
        uploading,
        uploadPhoto,
        mainPhotoId,
        photoIsMain,
        mainPhoto,
        setMainPhoto,
        deletePhoto,
      }}
    >
      {children}
    </MyPhotosContext.Provider>
  );
};

export const useMyPhotos = () => useContext(MyPhotosContext);
