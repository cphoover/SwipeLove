import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../db";
import { getUserId } from "../utils";
import { useLoadingBar } from "./LoadingBarProvider";

const UserDataContext = createContext();

export const MyUserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [myUserDataLoaded, setMyUserDataLoaded] = useState(false);
  const [myUserDataIsLoading, setMyUserDataIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hookRes = useLoadingBar();
  // const { initializeLoadingBar, finishLoadingBar } = hookRes;

  // const initializeLoadingBar = () => {};
  // const finishLoadingBar = () => {};
  useEffect(() => {
    const fetchUserData = async () => {
      // initializeLoadingBar("fetchMyUserData");
      setMyUserDataIsLoading(true);
      const userId = getUserId(); // Replace with actual user_id fetching logic
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error(error);
        setError(error);
      } else {
        setUserData(data);
      }
      setMyUserDataIsLoading(false);
      setMyUserDataLoaded(true);
      // finishLoadingBar("fetchMyUserData");
    };

    fetchUserData();
  }, []);

  const saveUserData = async (updatedData) => {
    const { data, error } = await supabase.from("user_profiles").upsert([
      {
        user_id: getUserId(), // Replace with actual user_id
        updated_at: new Date().toISOString(),
        ...updatedData,
      },
    ]).select('*');

    if (error) {
      console.error(error);
      setError(error);
    } else {
      setUserData(data[0]);
    }
  };

  const iAmRegistered = Boolean(userData?.first_name);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        iAmRegistered,
        myUserDataLoaded,
        myUserDataIsLoading,
        saveUserData,
        error,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useMyUser = () => {
  return useContext(UserDataContext);
};
